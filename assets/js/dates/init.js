
import $ from "cash-dom";
import "./human-date";
import { replace_date_picker, replace_date_time_picker } from "./picker";

function dates_init() {
  $('.date-picker').each((input) => {
    replace_date_picker(input);
  });
  $('.date-time-picker').each((input) => {
    replace_date_time_picker(input);
  });
}

$(dates_init);
