'use strict';

import $ from 'jquery';

var vrView;

class VrView {
  constructor($el) {
    if($('.js-vrview').length === 0) {
      return;
    }

    this.initVrView = this.initVrView.bind(this);
    this.updatePanorama = this.updatePanorama.bind(this);

    $(window).on('load', this.initVrView);
    $('.js-vrview-item').on('click', this.updatePanorama);
  }

  initVrView () {
    vrView = new VRView.Player('.js-vrview', {
      image: $('.js-vrview-item.btn-warning').attr('href')
    });
  }

  updatePanorama (e) {
    e.preventDefault();

    var image = $(e.currentTarget).attr('href');

    $('.js-vrview-item').removeClass('btn-warning').addClass('btn-primary');
    $(e.currentTarget).addClass('btn-warning');

    vrView.setContent({
      image: image
    });
  }
}

new VrView();
