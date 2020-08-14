defmodule Inkfish.Uploads.Git do
  alias Inkfish.Uploads
  alias Inkfish.Uploads.Upload

  def start_clone(url) do
    script = :code.priv_dir(:inkfish)
    |> Path.join("scripts/upload_git_clone.sh")

    uuid = Inkfish.Text.gen_uuid()
    :ok = Inkfish.Itty.start(uuid)
    :ok = Inkfish.Itty.run(uuid, script, REPO: url, SIZE: "5m")
    {:ok, uuid}
  end

  def get_results(uuid) do
    {:ok, text} = Inkfish.Itty.close(uuid)
    parse_results(text)
  end

  def parse_results(text) do
    results = String.split(text, "\n", trim: true)
    |> Enum.map(fn line ->
      [key, val] = String.split(line, ~r/:\s*/, parts: 2)
      {key, val}
    end)
    |> Enum.into(%{})
    {:ok, results}
  end

  def create_upload(data, kind, user_id) do
    %{"dir" => dir, "tar" => tar} = data
    file_name = Path.basename(tar)
    size = Upload.file_size(tar)

    params = %{
      "kind" => kind,
      "user_id" => user_id,
      "name" => file_name,
      "size" => size,
    }
    {:ok, upload} = Uploads.create_git_upload(params)

    File.cp!(tar, Upload.upload_path(upload))
    File.cp_r!(dir, Upload.unpacked_path(upload))

    {:ok, Upload.fetch_size(upload)}
  end
end
