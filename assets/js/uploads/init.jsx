import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'cash-dom';

import Uploader from './file_uploader';

function init() {
  $('.file-uploader').each((_ii, item) => {
    let token = $(item).data('token');
    let field = $(item).data('upload-field');
    ReactDOM.render(
      <Uploader token={token} uploadField={field} />,
      item);
  });
}

$(init);
