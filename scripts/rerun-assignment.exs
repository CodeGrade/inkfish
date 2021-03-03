alias Inkfish.Grades
alias Inkfish.Subs
alias Inkfish.Assignments
alias Inkfish.Container.Job
alias Inkfish.Uploads.Upload

defmodule A do
  def listen do
    receive do
      any -> IO.inspect({:got, any})
    end
    listen()
  end

  def print2(a, b) do
    IO.inspect({:p2, a, b})
  end

  def autograde(grade_id) do
      key = Inkfish.Text.zeropad(grade_id, 8)
      job = %Job{
        key: key,
        uuid: grade.log_uuid,
        container: %{
          base: "debian:buster",
          packages: ["clang", "clang-tools", "valgrind"],
          user_commands: [
            "curl https://sh.rustup.rs -sSf | sh -s -- -y",
          ],
          size_limit: "10M",
        },
        driver: %{
          script: "classic",
          SUB: Upload.upload_url(grade.sub.upload),
          GRA: Upload.upload_url(grade.grade_column.upload),
        },
      }

      rv = Inkfish.Container.Queue.add(job, &A.print2/2)
      IO.inspect(rv)

      Inkfish.Itty.open(grade.log_uuid)
      A.listen
  end

  def nil_script?(sub) do
    Enum.all? sub.grades, fn gr ->
      gr.score == nil
    end
  end
end

[arg1] = System.argv()

{asg_id, _} = Integer.parse(arg1)


asg = Assignments.get_assignment!(asg_id)

Enum.each asg.subs, fn sub ->
  sub = Subs.get_sub!(sub_id)
  if sub.active && A.nil_script?(sub) do
    Enum.each asg.grade_columns, fn gcol ->
      if gcol.kind == "script" do
        uuid = Inkfish.Text.gen_uuid()
        attrs = %{
          grade_column_id: gcol.id,
          sub_id: sub.id,
          log_uuid: uuid,
        }
        {:ok, grade} = Grades.create_grade(attrs)

        grade = Grades.get_grade_for_autograding!(grade.id)
        IO.inspect(grade)

        A.autograde(grade.id)
      end
    end
  end
end
