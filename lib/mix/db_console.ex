defmodule Mix.Tasks.Db.Console do
  use Mix.Task

  def run(_) do
    conf = Application.fetch_env!(:inkfish, Inkfish.Repo)

    if conf[:url] do
      url  = conf[:url]
      cs = Regex.run(~r{^ecto://(\w+):(\w+)@(\w+)/(\w+)$}, url)
      [_, user, pass, host, db] = cs
      show_cmd(user, pass, host, db)
    else
      show_cmd(conf[:username], conf[:password], conf[:hostname], conf[:database])
    end
  end

  def show_cmd(user, pass, host, db) do
    cmd0 = ~s(PGPASSWORD='#{pass}' psql -h '#{host}' )
    cmd1 = ~s(-U '#{user}' '#{db}')
    cmnd = cmd0 <> cmd1
    IO.puts "#{cmnd}"
  end
end
