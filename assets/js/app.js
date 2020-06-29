// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import css from "../css/app.scss";

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import dependencies
import "phoenix_html";
import "react-bootstrap";
import feather from 'feather-icons';
import $ from 'domtastic';

// Import local files
//
// Local files can be imported directly using relative paths, for example:
import socket from "./socket";
import "./uploads";
import "./search";
import "./grades/number-input";
import "./code-view/init";
import init_dates from "./human-date";
import init_teams from "./teams/team-manager";
import init_upload from "./uploads/upload";
import init_autograde from './autograde';

$(() => {
  init_upload('upload-root', 'sub_upload_id');
  init_autograde();

  init_dates();
  init_teams();
  $('.toggle').bootstrapToggle();
  feather.replace();
});

/*
  FIXME: handle date-time pickers
function init_date_time_pickers() {
  $('.date-time-picker').datetimepicker({
    format: "Y-m-d H:i:59",
    allowTimes: ["3:59", "7:59", "11:59", "15:59", "19:59", "23:59"],
  });
  $('.date-picker').datetimepicker({
    timepicker: false,
    format: "Y-m-d",
  });
}
*/
