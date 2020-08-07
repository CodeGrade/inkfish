import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Card, Button } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import filesize from 'filesize';

import UploadInfo from './upload_info';
import { upload_file } from '../ajax';

export default function FileUploader({token, setUploadId}) {
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
    setUploadId("");
  }

  function gotProgress(info) {
    set_prog("" + info.loaded + " / " + info.total);
  }

  function gotFile(acceptedFiles) {
    if (acceptedFiles.length > 0) {
      let file = acceptedFiles[0];
      set_file(file);
      let [req, cancel_tok] = upload_file(file, token, gotProgress);
      set_ctok(cancel_tok);
      req
        .then((info) => {
          console.log("upload complete", info);
          set_resp(info.data);
          setUploadId(info.data.id);
        })
        .catch((ee) => {
          if (ee.response) {
            set_prog("Failed: " + JSON.stringify(ee.response.data));
          }
          else {
            set_prog("Failed: " + ee);
          }
        });
    }
  }

  function clearFile() {
    set_file(null);
    setUploadId("");
  }

  const {getRootProps, getInputProps, open} = useDropzone({
    noClick: true,
    noKeyboard: true,
    multiple: false,
    onDrop: gotFile,
  });

  if (file && resp) {
    return (
      <UploadInfo upload={resp} clear={clearFile} />
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

