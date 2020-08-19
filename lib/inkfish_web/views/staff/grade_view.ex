defmodule InkfishWeb.Staff.GradeView do
  use InkfishWeb, :view

  def render("grade.json", %{grade: grade}) do
    gc = get_assoc(grade, :grade_column)
    lcs = get_assoc(grade, :line_comments) || []
    sub = get_assoc(grade, :sub)

    %{
      id: grade.id,
      score: grade.score,
      sub_id: grade.sub_id,
      sub: render_one(sub, InkfishWeb.Staff.SubView, "sub.json"),
      grade_column_id: grade.grade_column_id,
      grade_column: render_one(gc, InkfishWeb.GradeColumnView, "grade_column.json"),
      line_comments: render_many(lcs, InkfishWeb.Staff.LineCommentView, "line_comment.json")
    }
  end
end

