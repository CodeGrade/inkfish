defmodule AddStaffTeam do
  alias Inkfish.Users
  alias Inkfish.Assignments
  alias Inkfish.Courses
  alias Inkfish.Assignments
  alias Inkfish.Teams
  alias InkfishWeb.ViewHelpers

  def main(asg_id) do
    as = Assignments.get_assignment!(asg_id)
    bucket = Courses.get_bucket!(as.bucket_id)
    course = Courses.get_course!(bucket.course_id)
    staff = Users.list_regs_for_course(course)
    |> Enum.filter(&(&1.is_staff || &1.is_prof))

    IO.inspect({as.name, bucket.name, course.name})

    team_attrs = %{
      active: true,
      teamset_id: as.teamset_id,
      regs: staff
    }

    IO.inspect(team_attrs)
    Inkfish.Teams.create_team(team_attrs) 
  end
end

argv = System.argv()
IO.inspect({:argv, argv})

[asg_id] = argv
{asg_id, _} = Integer.parse(asg_id)

AddStaffTeam.main(asg_id)
