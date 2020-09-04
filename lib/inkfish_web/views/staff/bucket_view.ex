defmodule InkfishWeb.Staff.BucketView do
  use InkfishWeb, :view

  alias InkfishWeb.Staff.AssignmentView

  def render("bucket.json", %{bucket: bucket}) do
    assignments = get_assoc(bucket, :assignments) || []

    %{
      name: bucket.name,
      assignments: render_many(assignments, AssignmentView, "assignment.json"),
    }
  end
end
