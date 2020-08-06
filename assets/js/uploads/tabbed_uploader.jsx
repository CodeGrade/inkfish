import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Tab, Tabs, Card, Button, Alert } from 'react-bootstrap';
import classnames from 'classnames';

import FileUploader from './file_uploader';
import GitUploader from './git_uploader';
import * as history from '../console/history';

export default function TabbedUploader({allowGit, allowFile, onSuccess, token, nonce}) {
  allowFile = (allowFile == "true");
  allowGit = (allowGit == "true");

  if (allowGit && allowFile) {
    return (
      <UploadForms onSuccess={onSuccess} token={token} nonce={nonce} />
    );
  }

  if (allowFile) {
    return (
      <FileUploader onSuccess={onSuccess} token={token} nonce={nonce} />
    );
  }

  if (allowGit) {
    return (
      <GitUploader onSuccess={onSuccess} token={token} nonce={nonce} />
    );
  }

  return (
    <div>
      <p>TabbedUploader: No upload methods enabled.</p>
    </div>
  );
}

function UploadForms({onSuccess, token, nonce}) {
  const [tab, setTab] = useState('file');

  return (
    <Tabs activeKey={tab} onSelect={(k) => setTab(k)}>
      <Tab eventKey="file" title="Upload File">
        <FileUploader onSuccess={onSuccess} token={token} />
      </Tab>
      <Tab eventKey="git" title="Clone Git Repo">
        <GitUploader onSuccess={onSuccess} token={token} nonce={nonce} />
      </Tab>
    </Tabs>
  );
}
