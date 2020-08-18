defmodule Inkfish.Repo.Migrations.CreateGrades do
  use Ecto.Migration

  def change do
    create table(:grades) do
      add :score, :decimal
      add :sub_id, references(:subs, on_delete: :delete_all), null: false
      add :grade_column_id, references(:grade_columns, on_delete: :delete_all), null: false

      timestamps()
    end

    create index(:grades, [:sub_id])
    create index(:grades, [:grade_column_id])
    create index(:grades, [:sub_id, :grade_column_id], unique: true)
  end
end
