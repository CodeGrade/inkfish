
import $ from 'cash-dom';

function toggle_collapse(ev, target) {
  $(target).each((_ii, item) => {
    item.classList.toggle("collapse");
  });
}

function init() {
  $('.data-toggle').each((_ii, item) => {
    if (item.dataset.toggle == "collapse") {
      let target = item.dataset.target;
      $(item).on("click", (ev) => toggle_collapse(ev, target));
    }
  });
}

$(init);
