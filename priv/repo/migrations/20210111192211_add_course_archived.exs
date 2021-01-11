defmodule Inkfish.Repo.Migrations.AddCourseArchived do
  use Ecto.Migration

  def change do
    alter table("courses") do
      add :archived, :boolean, null: false, default: false
    end
  end
end
