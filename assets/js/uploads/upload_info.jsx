import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Card, Button } from 'react-bootstrap';
import filesize from 'filesize';

export default function UploadInfo({upload, clear}) {
  return (
    <Card>
      <Card.Body>
        <p>
          <b>File:</b> {upload.name} - {filesize(upload.size, {round: 0})}
        </p>
        <p>
          <Button variant="danger" onClick={clear}>
            Clear
          </Button>
        </p>
      </Card.Body>
    </Card>
  );
}
