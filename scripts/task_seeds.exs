# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Inkfish.Repo.insert!(%Inkfish.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias Inkfish.Repo
alias Inkfish.LocalTime

alias Inkfish.Users
alias Inkfish.Users.User
alias Inkfish.Users.Reg
alias Inkfish.Courses
alias Inkfish.Courses.Course
alias Inkfish.Courses.Bucket
alias Inkfish.Assignments.Assignment
alias Inkfish.Grades.GradeColumn
alias Inkfish.Subs
alias Inkfish.Uploads
alias Inkfish.Teams

defmodule Make do
  def user(name, admin \\ false) do
    name = String.downcase(name)
    user = %User{
      login: name,
      given_name: String.capitalize(name),
      surname: "Anderson", 
      email: "#{name}@example.com",
      is_admin: admin,
    } 
    
    Repo.insert!(user)
  end

  def course(name) do
    Repo.insert!(%Course{name: name, start_date: Date.utc_today()})
  end

  def reg(user, course, attrs) do
    %Reg{user_id: user.id, course_id: course.id}
    |> Map.merge(Enum.into(attrs, %{}))
    |> Repo.insert!()
  end

  def bucket(course, name, weight) do
    %Bucket{course_id: course.id, name: name, weight: weight}
    |> Repo.insert!()
  end

  def assignment(bucket, name) do
    course = Inkfish.Courses.get_course!(bucket.course_id)
    %Assignment{
      bucket_id: bucket.id,
      name: name,
      teamset_id: course.solo_teamset_id,
      weight: Decimal.new(1),
      desc: "do stuff",
      due: LocalTime.in_days(0),
    }
    |> Repo.insert!()
  end

  def feedback_gcol(asg, name) do
    %GradeColumn{
      kind: "feedback",
      name: name,
      points: Decimal.new("50"),
      base: Decimal.new("0"),
      assignment_id: asg.id,
    }
    |> Repo.insert!()
  end

  def stock_setup() do
    course_name = "Machine Learning for Film"
    course = Courses.get_course_by_name(course_name)
    if course do
      a1 = hd(hd(course.buckets).assignments)
      {course, a1}
    else
      _uA = Users.get_user_by_login!("alice")
      uB = Users.get_user_by_login!("bob")
      uC = Users.get_user_by_login!("carol")
      uD = Users.get_user_by_login!("dave")
      uE = Users.get_user_by_login!("erin")
      uF = Users.get_user_by_login!("frank")

      course = Make.course(course_name)

      Make.reg(uB, course, is_prof: true)
      Make.reg(uC, course, is_staff: true, is_grader: true)
      Make.reg(uD, course, is_staff: true, is_grader: true)
      Make.reg(uE, course, is_student: true)
      Make.reg(uF, course, is_student: true)

      b0 = Make.bucket(course, "Homework", Decimal.new("1.0"))
      a1 = Make.assignment(b0, "HW01")
      g1 = Make.feedback_gcol(a1, "Feedback")

      {course, a1}
    end
  end

  def sub(course, asg, login) do
    usr = Users.get_user_by_login!(login)
    reg = Users.find_reg(usr, course)
    team = Teams.get_active_team(asg, reg)
    {:ok, upl} = Uploads.create_fake_upload(usr)
    attrs = %{
      assignment_id: asg.id,
      reg_id: reg.id,
      upload_id: upl.id,
      team_id: team.id,
    }
    {:ok, sub} = Subs.create_sub(attrs)
    sub
  end
end

{course, asg} = Make.stock_setup()

sub1 =  Make.sub(course, asg, "erin")
sub2 =  Make.sub(course, asg, "frank")

IO.inspect({:subs, sub1, sub2})
