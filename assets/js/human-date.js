
import $ from "domtastic";

/*
FIXME: Delete this once date-fns version shown to work.

import { DateTime } from "luxon";

export default function init_dates() {
  $('.human-date').each((_ii, elem) => {
    let text = elem.innerText;
    let date = DateTime.fromSQL(text);
    let human_date = date.toFormat('dddd, YYYY-MMM-DD');
    let human_time = date.toFormat('HH:mm');
    let rel_date = date.fromNow();
    elem.innerText = `${human_date} at ${human_time}; ${rel_date}`;
    $(elem).removeClass('human-date');
  });
}
*/

import { format, formatDistance, subDays, parse } from "date-fns";

function init_dates() {
  $('.human-date').each((_ii, elem) => {
    let text = elem.innerText;
    let date = parse(text, 'yyyy-MM-dd HH:mm:ss', new Date());
    let human_date = format(date, 'dddd, yyyy-MMM-dd');
    let human_time = format(date, 'HH:mm O');
    let rel_date = formatDistance(new Date(), date);
    elem.innerText = `${human_date} at ${human_time}; ${rel_date}`;
    $(elem).removeClass('human-date');
  });
}

$(init_dates);
