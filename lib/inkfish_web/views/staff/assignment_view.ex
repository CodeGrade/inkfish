defmodule InkfishWeb.Staff.AssignmentView do
  use InkfishWeb, :view

  alias InkfishWeb.Staff.BucketView
  alias InkfishWeb.Staff.TeamsetView
  alias InkfishWeb.Staff.GradeColumnView
  alias InkfishWeb.Staff.SubView

  def render("assignment.json", %{assignment: assignment}) do
    bucket = get_assoc(assignment, :bucket)
    teamset = get_assoc(assignment, :teamset)
    gcols = get_assoc(assignment, :grade_columns)
    subs = get_assoc(assignment, :subs) || []

    %{
      name: assignment.name,
      due: assignment.due,
      bucket: render_one(bucket, BucketView, "bucket.json"),
      teamset: render_one(teamset, TeamsetView, "teamset.json"),
      grade_columns: render_many(gcols, GradeColumnView, "grade_column.json"),
      subs: render_many(subs, SubView, "sub.json"),
    }
  end
end
