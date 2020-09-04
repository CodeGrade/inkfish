defmodule Mix.Tasks.Db.Console do
  use Mix.Task

  def run(_) do
    conf = Application.fetch_env!(:inkfish, Inkfish.Repo)
    url  = conf[:url]
    cs = Regex.run(~r{^ecto://(\w+):(\w+)@(\w+)/(\w+)$}, url)
    [_, user, pass, host, db] = cs
	
    cmd0 = ~s(PGPASSWORD='#{pass}' psql -h '#{host}' )
    cmd1 = ~s(-U '#{user}' '#{db}')
    cmnd = cmd0 <> cmd1
    IO.puts "#{cmnd}"
  end
end
