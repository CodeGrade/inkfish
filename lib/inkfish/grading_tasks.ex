defmodule Inkfish.GradingTasks do
  alias Inkfish.Courses
  alias Inkfish.Assignments
  alias Inkfish.Users

  def course_tasks(course) do
    course = Courses.get_course_for_grading_tasks!(course.id)

    asgs = Enum.flat_map course.buckets, fn bucket ->
      Enum.filter bucket.assignments, fn asg ->
        Enum.find asg.grade_columns, fn gc ->
          gc.kind == "feedback"
        end
      end
    end

    subs = Enum.flat_map asgs, fn asg ->
      Enum.filter asg.subs, fn sub ->
        grade = Enum.find sub.grades, fn gr ->
          gr.grade_column.kind == "feedback"
        end
        grade == nil || grade.score == nil
      end
    end

    subs
  end

  def assignment_tasks(asg) do
    asg = Assignments.get_assignment_for_grading_tasks!(asg.id)

    subs = Enum.filter asg.subs, fn sub ->
      grade = Enum.find sub.grades, fn gr ->
        gr.grade_column.kind == "feedback"
      end
      grade == nil || grade.score == nil
    end

    subs
  end

  def grader_tasks(reg) do
    reg = Users.get_reg_for_grading_tasks!(reg.id)
    reg.grading_subs
  end
end
