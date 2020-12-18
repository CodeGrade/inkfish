defmodule AddFakeSubs do
  alias Inkfish.Users
  alias Inkfish.Assignments
  alias Inkfish.Courses
  alias Inkfish.Assignments
  alias Inkfish.Subs
  alias Inkfish.Uploads
  alias Inkfish.Teams
  alias InkfishWeb.ViewHelpers

  def main(asg_id) do
    as = Assignments.get_assignment!(asg_id)
    bucket = Courses.get_bucket!(as.bucket_id)
    course = Courses.get_course!(bucket.course_id)
    studs = Users.list_regs_for_course(course)
    |> Enum.filter(&(&1.is_student))

    IO.inspect({as.name, bucket.name, course.name})

    Enum.each studs, fn student ->
      subs = Assignments.list_subs_for_reg(as.id, student)
      if length(subs) == 0 do
        solo = Teams.get_active_team(as, student)
        {:ok, upload} = Uploads.create_fake_upload(student.user)
        attrs = %{
          assignment_id: as.id,
          reg_id: student.id,
          team_id: solo.id,
          upload_id: upload.id,
          hours_spent: "1.0",
        }
       	{:ok, _sub} = Subs.create_sub(attrs) 
      end
    end
    
  end
end

argv = System.argv()
IO.inspect({:argv, argv})

[asg_id] = argv
{asg_id, _} = Integer.parse(asg_id)

AddFakeSubs.main(asg_id)
