import React from 'react';
import ReactDOM from 'react-dom';
import TreeMenu, { defaultChildren } from 'react-simple-tree-menu';
import { ListGroup, ListGroupItem, Input } from 'react-bootstrap';
import { freeze } from 'icepick';

export default function FileTree({data, grade, activePath, pickFile}) {
  let comment_counts = new Map();
  for (let lc of grade.line_comments) {
    if (comment_counts.has(lc.path)) {
      let count = comment_counts.get(lc.path);
      comment_counts.set(lc.path, count + 1);
    }
    else {
      comment_counts.set(lc.path, 1);
    }
  }

  let dirs = list_top_dirs(data.files);

  let grade_info = null;
  if (data.grade.id) {
      grade_info = <GradeInfo grade={grade} />;
  }

  return (
    <div className="h-100">
      { grade_info }
      <TreeMenu
        data={[data.files]}
        debounceTime={5}
        initialOpenNodes={dirs}>
        {({_search, items}) => (
          <ListGroup>
            {items.map((props) => (
              <ListItem {...props}
                        comment_counts={comment_counts}
                        active={props.label == activePath}
                        onClickLabel={(ev) => pickFile(ev, props)}/>
            ))}
          </ListGroup>
        )}
      </TreeMenu>
    </div>
  );
}

function GradeInfo({grade}) {
  let count = grade.line_comments.length;
  let sum   = _.sumBy(grade.line_comments, (lc) => +lc.points);
  if (sum > 0) {
    sum = `+${sum}`;
  }

  let team_users = _.map(grade.sub.team.regs, (reg) => reg.user.name);

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title">Grade Info</h4>
        <p>Base: {grade.grade_column.base}</p>
        <p>Comments: {count} ({sum})</p>
        <p>Total: {grade.score} / {grade.grade_column.points}</p>

        <h4>Submitter</h4>
        <p>Team: {team_users.join(', ')}</p>
        <p>User: {grade.sub.reg.user.name}</p>
      </div>
    </div>
  );
}

function list_top_dirs(data) {
  if (data.type != "directory") {
    return [];
  }

  if (data.key.match(/^\.git/)) {
    return [];
  }

  let ys = [data.key];

  for (let node of data.nodes) {
    ys = _.concat(ys, list_top_dirs(node));
  }

  return ys;
}

function ListItem(props) {
  if (props.hasNodes) {
    return <DirListItem {...props} />;
  }

  let badge = "";
  if (props.comment_counts.has(props.path)) {
    badge = (
      <span className="badge badge-info">
        {props.comment_counts.get(props.path)}
      </span>
    );
  }

  return (
    <ListGroupItem active={props.active}>
      <span className="tree-toggle">&nbsp;</span>
      <a href="#" onClick={props.onClickLabel}>
        {props.label}
      </a>
      <span className="mx-3">
        {badge}
      </span>
    </ListGroupItem>
  );
}

function DirListItem(props) {
  let toggle = (ev) => {
    ev.preventDefault();
    props.hasNodes && props.toggleNode && props.toggleNode()
  };

  return (
    <ListGroupItem active={props.active}>
      <span className="tree-toggle">
        <a href="#" onClick={toggle}>
          {props.isOpen ? "-" : "+" }
        </a>
      </span>
      <a href="#" onClick={toggle}>
        {props.label}
      </a>
    </ListGroupItem>
  );
}
