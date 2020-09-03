
import { mutate } from '../ajax';

export function set_grader(sub_id, grader_id, set_asg) {
  let path = '/staff/subs/' + sub_id;
  let body = {
    sub: { grader_id },
  };
  mutate('PATCH', path, body)
    .then((info) => {
      console.log("set_grader ok:", info);
      set_asg(info.assignment);
    })
    .catch((err) => {
      console.log("set_grader err:", err);
    });
}

export function clear_grader(sub_id) {
  set_grader(sub_id, "")
}
