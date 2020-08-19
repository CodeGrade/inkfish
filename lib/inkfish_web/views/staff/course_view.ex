defmodule InkfishWeb.Staff.CourseView do
  use InkfishWeb, :view

  def render("course.json", %{course: course}) do
    regs = get_assoc(course, :regs) || []
    buckets = get_assoc(course, :buckets) || []

    %{
      name: course.name,
      start_date: course.start_date,
      regs: render_many(regs, InkfishWeb.Staff.RegView, "reg.json"),
      buckets: render_many(buckets, InkfishWeb.Staff.BucketView, "bucket.json"),
     }
  end
end
