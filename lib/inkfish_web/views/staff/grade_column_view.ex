defmodule InkfishWeb.Staff.GradeColumnView do
  use InkfishWeb, :view

  def render("grade_column.json", %{grade_column: grade_column}) do
    %{
      kind: grade_column.kind,
    }
  end
end
