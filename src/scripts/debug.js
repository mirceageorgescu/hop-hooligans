'use strict';

import $ from 'jquery';

class Debug {
  constructor($el) {
    //grid
    if(this.getParam('grid') === 'true') {
      this.showGrid();
    }

    //baseline
    if(this.getParam('baseline') === 'true') {
      this.showBaseline();
    }
  }

  getParam(key) {
    var result = new RegExp(key + "=([^&]*)", "i").exec(window.location.search);
    return result && window.unescape(result[1]) || "";
  }

  showGrid() {
    $('html').addClass('has-visible-grid');
  }

  showBaseline() {
    $('html').addClass('has-visible-baseline');
  }
}

new Debug();
