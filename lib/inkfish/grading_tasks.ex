defmodule Inkfish.GradingTasks do
  alias Inkfish.Courses
  alias Inkfish.Assignments
  alias Inkfish.Users
  alias Inkfish.Subs

  def feedback_assignments(course) do
    Enum.flat_map course.buckets, fn bucket ->
      Enum.filter bucket.assignments, fn asg ->
        Enum.find asg.grade_columns, fn gc ->
          gc.kind == "feedback"
        end
      end
    end
  end

  def course_tasks(course) do
    course = Courses.get_course_for_grading_tasks!(course.id)
    asgs = feedback_assignments(course)

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

  def grader_course_task_count(course, reg) do
    asgs = feedback_assignments(course)
    Subs.count_subs_for_grader(asgs, reg)
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

  def assign_grading_tasks(asg) do
    asg = Assignments.get_assignment_for_grading_tasks!(asg.id)
    graders = Courses.list_course_graders(asg.bucket.course_id)

    counts = Enum.reduce asg.subs, %{}, fn (sub, counts) ->
      if sub.grader_id do
        xx = Map.get(counts, sub.grader_id, 0)
        Map.put(counts, sub.grader_id, xx + 1)
      else
        counts
      end
    end

    ts = Enum.filter Enum.shuffle(asg.subs), fn sub ->
      sub.grader_id == nil || !Enum.any?(graders, &(sub.grader_id == &1.id))
    end

    graders
    |> Enum.map(fn gdr ->
      xx = Map.get(counts, gdr.id, 0)
      {xx, gdr}
    end)
    |> Enum.sort_by(fn {xx, _gdr} -> xx end)
    |> assign_grading_tasks(ts)
  end

  def assign_grading_tasks(_graders, []) do
    :ok
  end

  def assign_grading_tasks([], _tasks) do
    {:error, "no graders"}
  end

  def assign_grading_tasks([{count, grader}|graders], [task|tasks]) do
    {:ok, _sub} = Subs.update_sub_grader(task, grader.id)

    [{count + 1, grader} | graders]
    |> Enum.sort_by(fn {xx, _gdr} -> xx end)
    |> assign_grading_tasks(tasks)
  end
end
