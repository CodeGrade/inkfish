import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Button, Form, Row, Col } from 'react-bootstrap';
import _ from 'lodash';

import { set_grader } from './ajax';

// TODO:
//  - Add state
//  - Ajax on click or dropdown select, updating a sub.grader
//    and getting a new asg.

export default function TaskEditor({graders, assignment}) {
  const [asg, setAsg] = useState(assignment);

  let gids = new Set(_.map(graders, (gdr) => gdr.id));

  let assigned = _.map(graders, (gr) => {
    let subs = _.filter(asg.subs, (sub) => sub.grader_id == gr.id);
    let tasks = _.map(subs, (sub) => (
      <tr key={sub.id}>
        <td>{sub.reg.user.name}</td>
        <td>
          <Button variant="warning" size="sm" onClick={() => set_grader(sub.id, "", setAsg)}>
            Unassign
          </Button>
        </td>
      </tr>
    ));

    return (
      <div key={gr.id}>
        <h2>{ gr.user.name }</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Student</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            { tasks }
          </tbody>
        </table>
      </div>
    );
  });

  let unassigned = _.map(
    _.filter(asg.subs, (sub) => !gids.has(sub.grader_id)),
    (sub) => (
      <tr key={sub.id}>
        <td>{sub.reg.user.name}</td>
        <td>
          <GraderSelect sub={sub} graders={graders}
                        onChange={(ev) => set_grader(sub.id, ev.target.value, setAsg)} />
        </td>
      </tr>
    )
  );

  return (
    <div>
      <h2>Unassigned</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Student</th>
            <th>Grader</th>
          </tr>
        </thead>
        <tbody>
          { unassigned }
        </tbody>
      </table>
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
