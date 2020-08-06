import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Card, Button, Alert, Row, Col, Form } from 'react-bootstrap';
import classnames from 'classnames';

import * as history from '../console/history';
import Console from '../console/console';

export default function GitUploader({onSuccess, token, nonce}) {
  const [url, setUrl] = useState("");
  const [upload, setUpload] = useState(null);
  const topic = "clone:" + nonce;

  function startClone() {
    history.done_hook(topic, (msg) => {
      console.log("done callback", msg);
      setUpload(msg.upload);
      onSuccess(msg.upload.id);
    });
    history.push(topic, "clone", {url});
  }

  if (upload) {
    return (
      <UploadInfo upload={upload} setUpload={setUpload} />
    );
  }

  function handle_enter(ev) {
    if (ev.which == 13) {
      ev.preventDefault();
      startClone();
    }
  }

  return (
    <Card>
      <Card.Body>
        <Row>
          <Col sm={2}>
            <Form.Label htmlFor="git-repo-url" className="col-form-label">
              Repo&nbsp;URL:
            </Form.Label>
          </Col>
          <Col sm={8} className="form-group">
            <Form.Control type="text" value={url}
                          onChange={(ev) => setUrl(ev.target.value)}
                          onKeyPress={handle_enter}
                          id="git-repo-url"
                          placeholder="https://github.com/YourName/repo.git" />
          </Col>
          <Col sm={2}>
            <Button color="secondary" onClick={startClone}>Clone Repo</Button>
          </Col>
        </Row>
        <Row>
          <Console topic={topic} className="clone-console" />
        </Row>
      </Card.Body>
    </Card>
  );
}

function UploadInfo({upload, setUpload}) {
  function clear(ev) {
    ev.preventDefault();
    setUpload(null);
  }

  return (
    <Card body>
      <p>
        <b>Selected File</b>: {upload.name} &nbsp;
        <Button color="danger" onClick={clear}>
          Remove
        </Button>
      </p>
    </Card>
  );
}
