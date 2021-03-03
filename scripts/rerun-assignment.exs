alias Inkfish.Grades
alias Inkfish.Subs
alias Inkfish.Assignments
alias Inkfish.Container.Job
alias Inkfish.Uploads.Upload
alias Inkfish.Repo

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

  def nil_script?(sub) do
    Enum.all? sub.grades, fn gr ->
      gr.score == nil
    end
  end
end

Inkfish.Container.Queue.start

[arg1] = System.argv()

{asg_id, _} = Integer.parse(arg1)


asg = Assignments.get_assignment!(asg_id)
      |> Repo.preload([subs: [:grades, reg: :user]])

subs = asg.subs
       |> Enum.filter(&(&1.active && A.nil_script?(&1)))

Enum.each Enum.take(subs, 2), fn sub ->
  hash = hd(Inkfish.Subs.autograde!(sub))
  IO.inspect({sub.reg.user.email, hash})
  Inkfish.Itty.open(hash)
  |> IO.inspect
  A.listen
end

queue = Inkfish.Container.Queue.list()
        |> Enum.filter(&(&1.idx != nil))

IO.inspect({:queue, length(queue)})
