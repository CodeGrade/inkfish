
import axios from 'axios';
import { readAsArrayBuffer } from 'promise-file-reader';

export async function get(path) {
  let resp = await fetch('/ajax' + path, {
    method: 'get',
    credentials: 'same-origin',
    headers: new Headers({
      'x-csrf-token': window.csrf_token,
      'content-type': "application/json; charset=UTF-8",
      'accept': 'application/json',
    }),
  });
  return resp.json;
}

export async function mutate(method, path, body) {
  let resp = await fetch('/ajax' + path, {
    method: method,
    credentials: 'same-origin',
    headers: new Headers({
      'x-csrf-token': window.csrf_token,
      'content-type': "application/json; charset=UTF-8",
      'accept': 'application/json',
    }),
    body: JSON.stringify(body),
  });
  return resp.json();
}

export async function post(path, body) {
  return mutate('post', path, body);
}

export function upload_file(file, token, prog_fn) {
  let source = axios.CancelToken.source();

  let body = new FormData();
  body.append("upload[token]", token);
  body.append("upload[upload]", file);

  let req = axios({
      method: 'post',
      url: '/ajax/uploads',
      data: body,
      headers: {
        'x-csrf-token': window.csrf_token,
        'accept': 'application/json',
      },
      cancelToken: source.token,
      onUploadProgress: prog_fn,
    });

  return [req, source];
}

export function create_line_comment(grade_id, path, line) {
  console.log("create comment", grade_id, path, line);
  let post_path = `/staff/grades/${grade_id}/line_comments`;
  let body = {
    line_comment: {
      grade_id: grade_id,
      path: path,
      line: line,
      text: "",
      points: "0",
    },
  };
  return post(post_path, body);
}

export function update_line_comment(lc_id, points, text) {
  let path = "/staff/line_comments/" + lc_id;
  let body = {
    line_comment: {
      points: points,
      text: text,
    }
  };
  return mutate('PATCH', path, body);
}

export function delete_line_comment(lc_id) {
  let path = "/staff/line_comments/" + lc_id;
  return mutate('DELETE', path, {});
}
