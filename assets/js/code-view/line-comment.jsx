import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import { AlertTriangle, Check, Save, Trash } from 'react-feather';

import { delete_line_comment, update_line_comment} from '../ajax';

export default function LineComment({data, setGrade}) {
  const [points, setPoints] = useState(data.points);
  const [text, setText] = useState(data.text);
  const [status, setStatus] = useState(null);

  let color = line_comment_color(points);
  let icons = [];

  if (status) {
    if (status == "ok") {
      icons.push(<Check />);
    }
    else {
      icons.push(<AlertTriangle />);
    }
  }


  function handle_enter(ev) {
    if (ev.which == 13) {
      ev.preventDefault();
      save(ev);
    }
  }

  function save_comment(ev) {
    ev.preventDefault();
    update_line_comment(data.id, points, text)
      .then((resp) => {
        console.log("update resp", resp);
        setGrade(resp.data.grade);
      });
  }

  function delete_comment(ev) {
    ev.preventDefault();
    delete_line_comment(data.id)
      .then((resp) => {
        console.log("delete resp", resp);
        setGrade(resp.data.grade);
      });
  }

  return (
    <Card className="comment-card">
      <Card.Body className={color}>
        <Row>
          <Col sm={9}>
            <p>Grader: {data.user.name}</p>
          </Col>
          <Col sm={3} className="text-right">
            { icons }
            <Button variant="success"
                    disabled={points == data.points && text == data.text}>
              <Save onClick={save_comment} />
            </Button>
            <Button variant="danger">
              <Trash onClick={delete_comment} />
            </Button>
          </Col>
        </Row>
        <Row>
          <Col sm={2}>
            <Form.Control type="number"
                          onKeyPress={handle_enter}
                          value={points}
                          onChange={(ev) => setPoints(ev.target.value)} />
          </Col>
          <Col sm={10}>
            <Form.Control as="textarea"
                          rows="3"
                          value={text}
                          onChange={(ev) => setText(ev.target.value)} />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

function line_comment_color(points) {
  let colors = "bg-secondary";
  if (points > 0) {
    colors = "bg-success text-white";
  }
  if (points < 0) {
    colors = "bg-warning";
  }
  return colors;
}
