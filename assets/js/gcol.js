
import $ from 'cash-dom';
import _ from 'lodash';

function init() {
  $('#grade_column_kind').each((_ii, item) => {
    $(item).on("change", (ev) => {
      $('#grade_column_name').each((_jj, item) => {
        let names = ["", "Feedback", "Script", "Number"];
        if (names.includes(item.value)) {
          item.value = _.upperFirst(ev.target.value);
        }
      });
    });
  });
}

$(init);
