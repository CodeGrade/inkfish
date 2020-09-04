defmodule Inkfish.Repo.Migrations.CreateAssignments do
  use Ecto.Migration

  def change do
    create table(:assignments) do
      add :name, :string, null: false
      add :desc, :text, null: false
      add :due, :naive_datetime, null: false
      add :weight, :decimal, null: false
      add :bucket_id, references(:buckets, on_delete: :delete_all), null: false
      add :teamset_id, references(:teamsets, on_delete: :delete_all), null: false
      add :starter_upload_id, references(:uploads, on_delete: :nilify_all, type: :binary_id)
      add :solution_upload_id, references(:uploads, on_delete: :nilify_all, type: :binary_id)
      add :allow_git, :boolean, default: true
      add :allow_upload, :boolean, default: true

      timestamps()
    end

    create index(:assignments, [:bucket_id])
    create index(:assignments, [:teamset_id])
  end
end
