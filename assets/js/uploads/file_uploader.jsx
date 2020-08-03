import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Card, Button } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import filesize from 'filesize';

import { upload_file1 } from '../ajax';

// TODO:
//  - Implement upload with axios
//  - Progress bar; canceling

export default function FileUploader({token, uploadField}) {
  const [file, set_file] = useState(null);
  const [resp, set_resp] = useState(null);
  const [prog, set_prog] = useState("0 / ??");
  const [ctok, set_ctok] = useState(null);

  function cancel() {
    if (ctok) {
      ctok.cancel("Upload cancelled by you.");
    }
    set_file(null);
    set_resp(null);
  }

  function gotProgress(info) {
    set_prog("" + info.loaded + " / " + info.total);
  }

  function gotFile(acceptedFiles) {
    if (acceptedFiles.length > 0) {
      let file = acceptedFiles[0];
      set_file(file);
      let [req, cancel_tok] = upload_file1(file, token, gotProgress);
      set_ctok(cancel_tok);
      req
        .then((info) => {
          console.log("upload complete", info);
          set_resp(info.data);
        })
        .catch((ee) => {
          set_prog("Failed: " + JSON.stringify(ee.response.data));
        });
    }
  }

  function clearFile() {
    console.log("clear file");
    set_file(null);
  }

  const {getRootProps, getInputProps, open} = useDropzone({
    noClick: true,
    noKeyboard: true,
    multiple: false,
    onDrop: gotFile,
  });

  if (file && resp) {
    return (
      <Card>
        <Card.Body>
          <p>
            <b>File:</b> {file.path} - {filesize(file.size, {round: 0})}
          </p>
          <p>
            UUID: { resp.id } &nbsp;
            <Button variant="warning" onClick={clearFile}>
              Clear
            </Button>
          </p>
        </Card.Body>
      </Card>
    );
  }

  if (file) {
    return (
      <Card>
        <Card.Body>
          <p>Uploading: {prog}</p>
          <p>
            <Button variant="danger" onClick={cancel}>
              Cancel
            </Button>
          </p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Body>
        <div {...getRootProps({className: 'dropzone'})}>
          <input {...getInputProps()} />
          <p>Drop files here or click browse.</p>
          <Button variant="secondary" onClick={open}>
            Browse
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

