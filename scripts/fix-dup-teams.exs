defmodule FixDupTeams do
  alias Inkfish.Users
  alias Inkfish.Assignments
  alias Inkfish.Courses
  alias Inkfish.Assignments
  alias Inkfish.Teams
  alias InkfishWeb.ViewHelpers

  def fix_teamset(ts) do
    IO.puts "Teamset: #{ts.name}"

    teams = Enum.reduce ts.teams, Map.new, fn (tt, acc) ->
      uids = Enum.map(tt.regs, &(&1.user_id)) |> Enum.sort
      Map.update acc, uids, [tt.id], fn xs ->
        Enum.sort([tt.id | xs])
      end
    end

    Enum.each Enum.into(teams, []), fn {uids, tids} ->
      if length(tids) > 1 do
        IO.puts "duplicates!"
        [_keep | drops] = tids
        Enum.each drops, fn tid ->
          team = Teams.get_team!(tid)
          Teams.delete_team(team)
        end
      end
    end
  end

  def main(course_id) do
    course = Courses.get_course!(course_id)
    tsets = Teams.list_teamsets(course)

    Enum.each tsets, fn ts ->
      Teams.get_teamset(ts.id)
      |> fix_teamset()
    end
  end
end

argv = System.argv()
IO.inspect({:argv, argv})

[course_id] = argv
{course_id, _} = Integer.parse(course_id)

FixDupTeams.main(course_id)
