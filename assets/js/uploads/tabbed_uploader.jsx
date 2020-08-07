import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Tab, Tabs, Card, Button, Alert } from 'react-bootstrap';
import classnames from 'classnames';

import FileUploader from './file_uploader';
import GitUploader from './git_uploader';
import * as history from '../console/history';

export default function TabbedUploader({allowGit, allowFile, setUploadId, token, nonce}) {
  allowFile = (allowFile == "true");
  allowGit = (allowGit == "true");

  if (allowGit && allowFile) {
    return (
      <UploadForms setUploadId={setUploadId} token={token} nonce={nonce} />
    );
  }

  if (allowFile) {
    return (
      <FileUploader setUploadId={setUploadId} token={token} nonce={nonce} />
    );
  }

  if (allowGit) {
    return (
      <GitUploader setUploadId={setUploadId} token={token} nonce={nonce} />
    );
  }

  return (
    <div>
      <p>TabbedUploader: No upload methods enabled.</p>
    </div>
  );
}

function UploadForms({setUploadId, token, nonce}) {
  const [tab, setTab] = useState('file');

  return (
    <Tabs activeKey={tab} onSelect={(k) => setTab(k)}>
      <Tab eventKey="file" title="Upload File">
        <FileUploader setUploadId={setUploadId} token={token} />
      </Tab>
      <Tab eventKey="git" title="Clone Git Repo">
        <GitUploader setUploadId={setUploadId} token={token} nonce={nonce} />
      </Tab>
    </Tabs>
  );
}
