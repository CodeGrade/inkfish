
import { parse, parseISO } from "date-fns";

export function parse_date(text) {
  return parse(text, 'yyyy-MM-dd', new Date());
}

export function parse_date_time(text) {
  if (text.match(/T/)) {
    return parseISO(text);
  }
  else {
    return parse(text, 'yyyy-MM-dd HH:mm:ssX', new Date());
  }
}
