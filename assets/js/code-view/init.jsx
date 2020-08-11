import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'cash-dom';

import Viewer from './viewer';

function init() {
  $('.code-viewer').each((_ii, item) => {
    ReactDOM.render(<Viewer data={window.code_view_data} />, item);
  });
}

$(init);

