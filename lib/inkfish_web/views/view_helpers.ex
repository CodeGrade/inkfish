defmodule InkfishWeb.ViewHelpers do
  # Helper functions available in all templates.

  use Phoenix.HTML

  alias Inkfish.Users.User
  alias Inkfish.Users.Reg
  alias Inkfish.Courses.Course
  alias Inkfish.Subs.Sub
  alias Inkfish.Grades.Grade
  alias Inkfish.Grades.GradeColumn
  alias Inkfish.Assignments.Assignment
  alias Inkfish.Teams.Team
  alias Inkfish.LocalTime

  def upload_token(conn, kind) do
    nonce = Base.encode16(:crypto.strong_rand_bytes(32))
    token = Phoenix.Token.sign(conn, "upload", %{kind: kind, nonce: nonce})
    %{
      nonce: nonce,
      token: token,
    }
  end

  def show_timestamp(ndt = %NaiveDateTime{}) do
    show_timestamp(LocalTime.from_naive!(ndt))
  end

  def show_timestamp(dt = %DateTime{}) do
    DateTime.to_iso8601(dt)
  end

  def user_display_name(nil) do
    "(none)"
  end

  def user_display_name(%Reg{} = reg) do
    user_display_name(reg.user)
  end

  def user_display_name(%User{} = user) do
    "#{user.given_name} #{user.surname}"
  end

  def is_staff?(reg, user) do
    reg.is_staff || reg.is_prof || user.is_admin
  end

  def show_reg_role(%Reg{} = reg) do
    cond do
      reg.is_prof ->
        "prof"
      reg.is_staff ->
        "staff"
      reg.is_student ->
        "student"
      true ->
        "observer"
    end
  end

  def show_team_members(%Team{} = team) do
    team.team_members
    |> Enum.map(&(user_display_name(&1.reg.user)))
    |> Enum.join(", ")
  end

  def show_team(nil) do
    "(none)"
  end

  def show_team(%Team{} = team) do
    members = show_team_members(team)
    "Team ##{team.id} (#{members})"
  end

  def show_teamset_assignments(ts) do
    Enum.join(Enum.map(ts.assignments, &(&1.name)), ", ")
  end

  def show_pct(nil) do
    "∅"
  end

  def show_pct(%Decimal{} = score) do
    ctx = %Decimal.Context{Decimal.get_context | precision: 3}
    Decimal.with_context ctx, fn ->
      score
      |> Decimal.add(Decimal.new("0"))
      |> Decimal.to_string(:normal)
    end
  end

  def show_letter_grade(%Course{} = _course, nil), do: "∅"

  def show_letter_grade(%Course{} = _course, %Decimal{} = score) do
    num = score
    |> Decimal.mult(Decimal.new(100))
    |> Decimal.round()
    |> Decimal.to_integer

    # FIXME: Global scale. Should be per course.
    # Scale for 5610 Fall 2019 was 2.2%.
    num = num + 350

    cond do
      num >= 9500 -> "A"
      num >= 9000 -> "A-"
      num >= 8500 -> "B+"
      num >= 8000 -> "B"
      num >= 7500 -> "B-"
      num >= 7000 -> "C+"
      num >= 6500 -> "C"
      num >= 6000 -> "C-"
      num >= 5000 -> "D"
      true -> "F"
    end
  end

  def show_score(%Decimal{} = score) do
    ctx = %Decimal.Context{Decimal.get_context | precision: 3}
    Decimal.with_context ctx, fn ->
      score
      |> Decimal.add(Decimal.new("0"))
      |> Decimal.to_string(:normal)
    end
  end

  def show_score(nil) do
    "∅"
  end

  def show_score(_conn, nil) do
    show_score(nil)
  end

  def show_score(conn, %Sub{} = sub) do
    asgn = conn.assigns[:assignment]
    show_score(conn, asgn, sub.score)
  end

  def show_score(conn, %Grade{} = grade) do
    asgn = conn.assigns[:assignment]
    show_score(conn, asgn, grade.score)
  end

  def show_score(conn, %Assignment{} = asgn) do
    sub = Enum.find asgn.subs, &(&1.active)
    show_score(conn, asgn, sub && sub.score)
  end

  def show_score(_conn, %GradeColumn{} = gcol) do
    show_score(gcol.points)
  end

  def show_score(_conn, %Assignment{} = _a, nil) do
    show_score(nil)
  end

  def show_score(conn, %Assignment{} = asgn, %Decimal{} = score) do
    user = conn.assigns[:current_user]
    reg  = conn.assigns[:current_reg]

    if is_staff?(reg, user) do
      show_score(score)
    else
      if grade_hidden?(conn, asgn) do
        # Hourglass with Flowing Sand
        raw "&#9203;"
      else
        show_score(score)
      end
    end
  end

  def grade_hidden?(conn, %Assignment{} = asgn) do
    course = conn.assigns[:course]

    grade_hide_secs = 86400 * course.grade_hide_days
    show_at = NaiveDateTime.add(asgn.due, grade_hide_secs)

    now = Inkfish.LocalTime.now()
    NaiveDateTime.compare(show_at, now) != :lt
  end

  def assignment_total_points(as) do
    Inkfish.Assignments.Assignment.assignment_total_points(as)
  end

  def trusted_markdown(nil), do: "∅"

  def trusted_markdown(code) do
    case Earmark.as_html(code) do
      {:ok, html, []} ->
        raw html
      {:error, _html, _msgs} ->
        raw "error rendering markdown"
    end
  end

  def sanitize_markdown(nil), do: "∅"

  def sanitize_markdown(code) do
    case Earmark.as_html(code) do
      {:ok, html, []} ->
        raw HtmlSanitizeEx.basic_html(html)
      {:error, _html, _msgs} ->
        raw "error rendering markdown"
    end
  end

  def ajax_upload_field(kind, _exts, target) do
    ajax_upload_field(kind, target)
  end

  def ajax_upload_field(kind, target) do
    %{nonce: nonce, token: token} = upload_token(InkfishWeb.Endpoint, kind)

    code = ~s(
      <div class="file-uploader"
           data-upload-field="#{target}"
           data-nonce="#{nonce}"
           data-token="#{token}">
        React loading...
      </div>
    )

    raw(code)
  end

  def render_autograde_log(items) do
    items
    |> Enum.map(fn item ->
      item["text"]
    end)
    |> Enum.join("")
  end

  def get_assoc(item, field) do
    data = Map.get(item, field)
    if Ecto.assoc_loaded?(data) do
      data
    else
      nil
    end
  end
end
