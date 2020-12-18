#!/bin/bash

export MIX_ENV=prod
export PORT=4081
export DATABASE_URL=$(cat ~/.config/inkfish/db_url)
export SECRET_KEY_BASE=$(cat ~/.config/inkfish/key_base)

