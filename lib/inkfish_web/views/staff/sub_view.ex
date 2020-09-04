defmodule InkfishWeb.Staff.SubView do
  use InkfishWeb, :view

  def render("sub.json", %{sub: sub}) do
    reg = get_assoc(sub, :reg)
    team = get_assoc(sub, :team)
    grades = get_assoc(sub, :grades) || []
    grader = get_assoc(sub, :grader)

    %{
      id: sub.id,
      active: sub.active,
      assignment_id: sub.assignment_id,
      inserted_at: sub.inserted_at,
      reg_id: sub.reg_id,
      reg: render_one(reg, InkfishWeb.Staff.RegView, "reg.json"),
      team_id: sub.team_id,
      team: render_one(team, InkfishWeb.Staff.TeamView, "team.json"),
      grades: render_many(grades, InkfishWeb.Staff.GradeView, "grade.json"),
      grader_id: sub.grader_id,
      grader: render_one(grader, InkfishWeb.RegView, "reg.json"),
    }
  end
end
