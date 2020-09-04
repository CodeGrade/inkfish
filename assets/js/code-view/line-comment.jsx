import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import { AlertTriangle, Check, Save, Trash } from 'react-feather';

import { delete_line_comment, update_line_comment} from '../ajax';

export default function LineComment({data, setGrade, edit, node}) {
  const [points, setPoints] = useState(data.points);
  const [text, setText] = useState(data.text);
  const [status, setStatus] = useState(null);

  useEffect(() => node.changed());

  let color = line_comment_color(points);
  let icons = [];

  if (status) {
    if (status == "ok") {
      // TODO: Make this actually display.
      console.log("check icon");
      icons.push(<Check key="ok" />);
    }
    else {
      // TODO: Show error message.
      console.log("alert icon");
      icons.push(<AlertTriangle key="err" />);
    }
  }

  function clearStatus() {
    window.setTimeout(() => setStatus(null), 5);
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
        setStatus("ok");
        setGrade(resp.data.grade);
      })
      .catch((resp) => {
        let msg = JSON.stringify(resp);
        setStatus(msg);
        console.log("error saving", msg);
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

  function Buttons({edit}) {
    if (edit) {
      return (
        <span>
          <Button variant="success"
                  disabled={points == data.points && text == data.text}>
            <Save onClick={save_comment} />
          </Button>
          <Button variant="danger">
            <Trash onClick={delete_comment} />
          </Button>
        </span>
      );
    }
    else {
      return (<span />);
    }
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
            &nbsp;
            <Buttons edit={edit} />
          </Col>
        </Row>
        <Row>
          <Col sm={2}>
            <Form.Control type="number"
                          onKeyPress={handle_enter}
                          value={points}
                          disabled={!edit}
                          onChange={(ev) => {
                            setPoints(ev.target.value);
                            clearStatus();
                          }} />
          </Col>
          <Col sm={10}>
            <Form.Control as="textarea"
                          rows="3"
                          value={text}
                          disabled={!edit}
                          onChange={(ev) => {
                            setText(ev.target.value);
                            clearStatus();
                          }} />
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
