
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

export async function post(path, body) {
  let resp = await fetch('/ajax' + path, {
    method: 'post',
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
