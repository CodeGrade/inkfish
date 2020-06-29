#!/bin/bash
export STATS=/tmp/size-stats.json
export PATH=$(pwd)/node_modules/.bin:$PATH
webpack --profile --json > $STATS
webpack-bundle-analyzer -s stat $STATS ../priv/static/js
