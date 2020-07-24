
import { format, formatDistance, subDays } from "date-fns";

import $ from "cash-dom";
import { parse_date_time } from "./parse";


function init_dates() {
  $('.human-date').each((_ii, elem) => {
    let text = elem.innerText;
    let date = parse_date_time(text);
    let human_date = format(date, 'dddd, yyyy-MMM-dd');
    let human_time = format(date, 'HH:mmx');
    let rel_date = formatDistance(new Date(), date);
    elem.innerText = `${human_date} at ${human_time}; ${rel_date}`;
    $(elem).removeClass('human-date');
  });
}

$(init_dates);
