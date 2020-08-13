defmodule Inkfish.Itty do
  alias Inkfish.Itty.Server

  @doc """
  Returns ???
  """
  def start() do
    uuid = Inkfish.Text.gen_uuid()
    start(uuid)
  end

  def start(uuid) do
    Server.start(uuid, &null_fn/1)
  end

  def start(uuid, on_exit) do
    Server.start(on_exit)
  end

  def null_fn(_) do
    :ok
  end

  def run(uuid, cmd, env) do
    Server.run(uuid, cmd, env)
  end

  def echo(uuid, msg) do
    Server.echo(uuid, msg)
  end

  @doc """
  Subscribes the current process to event messages.

  Returns {:ok, prev_data}
  """
  def open(uuid) do
    open(uuid, self())
  end

  def open(uuid, rpid) do
    Server.open(uuid, rpid)
  end

  @doc """
  Returns {:ok, output_text}
  """
  def close(uuid) do
    close(uuid, self())
  end

  def close(uuid, rpid) do
    Server.close(uuid, rpid)
  end
end
