
import { parse } from "date-fns";

export function parse_date(text) {
    return parse(text, 'yyyy-MM-dd', new Date());
}

export function parse_date_time(text) {
    return parse(text, 'yyyy-MM-dd HH:mm:ssX', new Date());
}
