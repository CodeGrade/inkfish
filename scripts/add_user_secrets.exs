defmodule AddUserSecrets do
  alias Inkfish.Users

  def main do
    users = Users.list_users()

    Enum.each users, fn user ->
      IO.inspect(user)
      {:ok, user} = Users.add_secret(user)
      IO.inspect(user)
    end
  end
end

AddUserSecrets.main
