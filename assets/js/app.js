// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import css from "../css/app.scss";

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import dependencies
import "regenerator-runtime/runtime";
import "core-js/stable";

import "phoenix_html";
import "react-bootstrap";
import $ from 'cash-dom';

// Import local files
//
// Local files can be imported directly using relative paths, for example:
import socket from "./socket";
import "./uploads";
import "./search";
import "./grades/number-input";
import "./code-view/init";
import "./dates/init";
import "./uploads/init";
import init_teams from "./teams/team-manager";
import init_autograde from './autograde';

function app_init() {
  init_autograde();
  init_teams();
}

$(app_init);
