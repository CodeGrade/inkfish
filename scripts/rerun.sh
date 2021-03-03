
#!/bin/bash

export MIX_ENV=prod
export PORT=4080
export DATABASE_URL=$(cat ~/.config/inkfish/db_url)
export SECRET_KEY_BASE=$(cat ~/.config/inkfish/key_base)
export NOSERVER=1

mix run scripts/rerun-assignment.exs $1
