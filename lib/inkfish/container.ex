defmodule Inkfish.Container do
  alias Inkfish.Container.Server
  alias Inkfish.Container.Queue
  alias Inkfish.Container.Job

  alias Inkfish.Subs
  alias Inkfish.Subs.Sub
  alias Inkfish.Grades
  alias Inkfish.Grades.Grade
  alias Inkfish.Uploads.Upload
  alias Inkfish.Itty

  @doc """
  Start the autograding process given a grade_id.

  Returns {:ok, pid, uuid} for the associated Itty.
  """
  def start(key) do
    {:ok, pid} = Server.start(key)
    {:ok, uuid} = Server.get_uuid(pid)
    {:ok, pid, uuid}
  end

  def wait(pid) do
    Server.wait(pid)
  end

  def enqueue(%Grade{} = grade) do
    key = Inkfish.Text.zeropad(grade.id, 8)
    job = %Job{
      key: key,
      uuid: grade.log_uuid,
      container: %{
        base: "debian:buster",
        packages: [
          "clang", "clang-tools", "valgrind", "libarchive-zip-perl",
          "libfuse-dev", "pkg-config", "libexpect-perl",  
          "qemu-system-x86", "qemu-utils"
        ],
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
    Queue.add(job, &container_done/2)
  end

  def container_done(job, tap) do
    grade = Grades.get_grade_by_log_uuid(job.uuid)
    {:ok, {passed, total}} = Inkfish.Container.Tap.score(tap)
    score = passed
    |> Decimal.div(total)
    |> Decimal.mult(grade.grade_column.points)
    {:ok, _} = Grades.update_grade(grade, %{score: score})
    {:ok, _} = Subs.calc_sub_score!(grade.sub_id)
  end
end
