'use strict';

import $ from 'jquery';

class Touch {
  constructor($el) {
    if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
      $('html').addClass('touch');
    } else {
      $('html').addClass('no-touch');
    }
  }
}

new Touch();
