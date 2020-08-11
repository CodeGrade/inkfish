import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Row, Col, ListGroup } from 'react-bootstrap';
import TreeMenu, { defaultChildren } from 'react-simple-tree-menu';

import FileTree from './file-tree';
import FileViewer from './file-viewer';

export default function Viewer({data}) {
  const [activePath, setActivePath] = useState("");
  const [grade, setGrade] = useState(data.grade);

  //console.log(data);

  function pickFile(ev, props) {
    ev.preventDefault();
    setActivePath(props.path);
  }

  return (
    <Row className="vh-100">
      <Col md={3} className="h-100">
        <FileTree data={data}
                  grade={grade}
                  activePath={activePath}
                  pickFile={pickFile} />
      </Col>
      <Col md={9} className="h-100">
        <FileViewer data={data}
                    path={activePath}
                    grade={grade}
                    setGrade={setGrade} />
      </Col>
    </Row>
  );
}

