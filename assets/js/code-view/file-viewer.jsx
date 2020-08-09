import React, { useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { Card } from 'react-bootstrap';
import _ from 'lodash';

import CodeMirror from 'codemirror';
import registerElixirMode from 'codemirror-mode-elixir';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/gas/gas';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/mode/css/css';
import 'codemirror/mode/sass/sass';

import LineComment from './line-comment';

import { create_line_comment } from '../ajax';

// TODO:
//  - Port over line comment widget from old version.

export default function FileViewer({path, data, grade, setGrade}) {
  const texts = useMemo(() => build_texts_map(data.files), [data.files]);
  const editor = useRef(null);

  //console.log("grade", grade);

  function gutter_click(_cm, line, _class, ev) {
    ev.preventDefault();
    _.debounce(() => {
      create_line_comment(grade.id, path, line)
        .then((resp) => {
          console.log("resp", resp);
          setGrade(resp.data.grade);
        });
    }, 100, {leading: true})();
  }

  useEffect(() => {
    let cm = CodeMirror(editor.current, {
      readOnly: true,
      lineNumbers: true,
      lineWrapping: true,
      value: texts.get(path) || "(missing)",
    });

    if (data.edit) {
      cm.on("gutterClick", gutter_click);
    }

    for (let lc of grade.line_comments) {
      if (lc.path != path) {
        continue;
      }

      let lc_div = document.createElement("div");
      lc_div.setAttribute('id', `line-comment-${lc.id}`);
      let node = cm.addLineWidget(lc.line, lc_div, {above: true});
      ReactDOM.render(
        <LineComment data={lc} setGrade={setGrade} />,
        lc_div
      );
    }

    //console.log("insert codemirror");

    return () => {
      cm.getWrapperElement().remove();
      //console.log("remove codemirror");
    };
  });

  if (path == "") {
    return (
      <Card>
        <Card.Body>
          <p>Select a file from the list to the left.</p>
          <p>Click items starting with "+" to expand a directory.</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="h-100">
      <Card.Body className="h-100">
        <Card.Title>{path}</Card.Title>
        <div ref={editor} />
      </Card.Body>
    </Card>
  );
}

function build_texts_map(node) {
  let mm = new Map();

  if (node.text) {
    mm.set(node.path, node.text);
  }

  if (node.nodes) {
    for (let kid of node.nodes) {
      let kidmap = build_texts_map(kid);
      for (let [kk, vv] of kidmap) {
        mm.set(kk, vv);
      }
    }
  }

  return mm;
}

