#!/bin/bash

export MIX_ENV=prod
export PORT=4080
export DATABASE_URL=$(cat ~/.config/inkfish/db_url)
export SECRET_KEY_BASE=$(cat ~/.config/inkfish/key_base)

sudo service inkfish stop

echo "Building..."

mkdir -p ~/.config
mkdir -p priv/static

mix deps.get
mix compile
mix ecto.migrate

export NODEBIN=`pwd`/assets/node_modules/.bin
export PATH="$PATH:$NODEBIN"

(cd assets && npm install)
(cd assets && webpack --mode production)
mix phx.digest

echo "Generating release..."
mix release --overwrite

#echo "Stopping old copy of app, if any..."
#_build/prod/rel/draw/bin/practice stop || true

echo "Starting app..."

#_build/prod/rel/inkfish/bin/inkfish foreground

sudo service inkfish start
