import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Form, Row, Col } from 'react-bootstrap';
import _ from 'lodash';

// TODO:
//  - Add state
//  - Ajax on click or dropdown select, updating a sub.grader
//    and getting a new asg.

export default function TaskEditor({graders, asg}) {
  let gids = new Set(_.map(graders, (gdr) => gdr.id));

  let assigned = _.map(graders, (gr) => {
    let subs = _.filter(asg.subs, (sub) => sub.grader_id == gr.id);
    let tasks = _.map(subs, (sub) => (
      <li key={sub.id}>
        {sub.reg.user.name} &nbsp;
        <Button variant="warning" size="sm" onClick={() => console.log(sub)}>
          Unassign
        </Button>
      </li>
    ));

    return (
      <div key={gr.id}>
        <h2>{ gr.user.name }</h2>
        <ul>
          { tasks }
        </ul>
      </div>
    );
  });

  let unassigned = _.map(
    _.filter(asg.subs, (sub) => !gids.has(sub.grader_id)),
    (sub) => (
      <li key={sub.id}>
        {sub.reg.user.name}
        <GraderSelect sub={sub} graders={graders}
                      onChange={(ev) => console.log(ev)} />
      </li>
    )
  );

  return (
    <div>
      <h2>Unassigned</h2>
      <ul>
        { unassigned }
      </ul>
      { assigned }
    </div>
  );
}

function GraderSelect({sub, graders, onChange}) {
  let opts = _.map(graders, (gdr) => (
    <option key={gdr.id} value={gdr.id}>
      {gdr.user.name}
    </option>
  ));
  return (
    <Form.Control as="select" onChange={onChange}>
      <option value=""></option>
      { opts }
    </Form.Control>
  );
}
