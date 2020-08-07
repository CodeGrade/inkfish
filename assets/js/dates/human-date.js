
import { format, formatDistance, isBefore } from "date-fns";

import $ from "cash-dom";
import { parse_date_time } from "./parse";

function rel_text(aa, bb) {
  let date_diff = formatDistance(aa, bb);
  if (isBefore(aa, bb)) {
    return `in ${date_diff}`;
  }
  else {
    return `${date_diff} ago`;
  }
}

function show_date(text) {
    let date = parse_date_time(text);
    let human_date = format(date, 'EEEE, yyyy-MMM-dd');
    let human_time = format(date, 'HH:mm');
    let rel_date = rel_text(new Date(), date);
    return `${human_date} at ${human_time}; ${rel_date}`;
}

function init_dates() {
  $('.human-date').each((_ii, elem) => {
    let text = elem.innerText;
    let show = show_date(text);
    elem.innerText = show;
    $(elem).removeClass('human-date');
    console.log("replaced", text, "with", show);
  });
}

$(init_dates);
