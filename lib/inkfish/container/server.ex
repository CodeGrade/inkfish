defmodule Inkfish.Container.Server do
  use GenServer

  import Inkfish.Text, only: [corrupt_invalid_utf8: 1]

  alias Inkfish.Itty
  alias Inkfish.Container.Queue
  alias Inkfish.Container.Job

  alias Inkfish.Container.Image

  def start_link(key) do
    GenServer.start_link(__MODULE__, key)
  end

  def start(key) do
    spec = %{
      id: __MODULE__,
      start: {__MODULE__, :start_link, [key]},
      restart: :temporary,
    }
    DynamicSupervisor.start_child(Inkfish.Container.Sup, spec)
  end

  def wait(pid) do
    ref = Process.monitor(pid)
    receive do
      {:DOWN, ^ref, _, _, _} -> :ok
    end
  end

  def get_uuid(pid) do
    GenServer.call(pid, :get_uuid)
  end

  @impl true
  def init(key) do
    job = Queue.get(key)
    dsc = job.driver["script"] || job.driver[:script]

    priv = to_string(:code.priv_dir(:inkfish))
    script = Path.join(priv, "scripts/#{dsc}.pl")
    driver = Path.join(priv, "scripts/#{dsc}-driver.pl")

    {:ok, base, hash} = Image.prepare(job, driver)
    env = Job.env(job)
    |> Map.put("DIR", base)
    |> Map.put("TAG", hash)
    |> Enum.into([])

    #IO.inspect {:env, env}

    :ok = Itty.run(job.uuid, script, env)
    {:ok, %{exit: status, output: data}} = Itty.open(job.uuid)

    state = %{
      key: key,
      uuid: job.uuid,
      data: data,
    }

    if status do
      Process.send_after(self(), {:exit, status}, 10)
    end

    {:ok, state}
  end

  @impl true
  def handle_call(:get_uuid, _from, state) do
    {:reply, {:ok, state.uuid}, state}
  end

  @impl true
  def handle_info({:output, item}, state) do
    IO.inspect({:autograde, :output, item})
    state = Map.update!(state, :data, &([item | &1]))
    {:noreply, state}
  end

  def handle_info({:exit, status}, state) do
    {:ok, result} = Itty.close(state.uuid)

    log = state.data
    |> Enum.sort_by(fn {serial, _, _} -> serial end)
    |> Enum.map(fn {serial, stream, text} ->
      %{
        serial: serial,
        stream: stream,
        text: corrupt_invalid_utf8(text),
      }
    end)

    Queue.done(state.key, inspect(status), result, log)

    {:stop, :normal, state}
  end
end
