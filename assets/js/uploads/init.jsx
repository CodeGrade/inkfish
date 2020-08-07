import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'cash-dom';

import FileUploader from './file_uploader';
import TabbedUploader from './tabbed_uploader';
import * as history from '../console/history';

function render_uploader(Uploader, item) {
  let data = item.dataset;
  let field = data.uploadField;

  function gotUUID(uuid) {
    console.log("set ", field, " to " + uuid);
    let input = document.getElementById(field);
    input.value = uuid;
  }

  if (data.nonce) {
    const topic = "clone:" + data.nonce;
    history.join(topic, data.token, () => {});
  }

  ReactDOM.render(
    <Uploader setUploadId={gotUUID} {...data} />,
    item);
}

function init() {
  $('.file-uploader').each((_ii, item) => {
    render_uploader(FileUploader, item);
  });

  $('.tabbed-uploader').each((_ii, item) => {
    render_uploader(TabbedUploader, item);
  });
}

$(init);
