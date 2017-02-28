'use strict';

import $ from 'jquery';

var vrView;

class VrView {
  constructor($el) {
    if($el.length === 0) {
      return;
    }

    this.ui = {
      el: $el,
      hotspot: $el.find('.js-hotspot'),
      scenes: $('.js-vrview-item')
    }

    this.initVrView = this.initVrView.bind(this);
    this.updateScene = this.updateScene.bind(this);
    this.selectScene = this.selectScene.bind(this);
    this.addHotspots = this.addHotspots.bind(this);
    this.showHotspot = this.showHotspot.bind(this);
    this.closeHotspot = this.closeHotspot.bind(this);

    //get active scene
    var sceneIndex = $('.js-vrview-item.btn-warning').attr('data-index');
    this.scene = window.locals.brewery.scenes[sceneIndex];

    //init
    $(window).on('load', this.initVrView);

    //select scene
    this.ui.scenes.on('click', this.selectScene);
  }

  initVrView () {
    var self = this;

    vrView = new VRView.Player('.js-vrview', {
      image: this.scene.img,
      // is_debug: true
    });

    vrView.on('ready',function(){
      setTimeout(function(){
        self.addHotspots();
      }, 2000);
    }, this);

    vrView.on('click', function(event) {
      this.showHotspot(event.id)
    }, this);
  }

  selectScene (e) {
    var index = $(e.currentTarget).attr('data-index');
    e.preventDefault();

    $('.js-vrview-item').removeClass('btn-warning').addClass('btn-primary');
    $(e.currentTarget).addClass('btn-warning');

    this.closeHotspot(e);
    this.updateScene(index);
  }

  updateScene (sceneIndex) {
    var self = this;

    this.scene = window.locals.brewery.scenes[sceneIndex];

    vrView.setContent({
      image: this.scene.img,
      is_autopan_off: true
    }, this);

    setTimeout(function(){
      self.addHotspots();
    }, 2000);

  }

  addHotspots () {
    if(this.scene.hotspots) {
      $.each(this.scene.hotspots, function( index, hotspot ) {
        vrView.addHotspot(hotspot.id, hotspot.location);
      });
    }
  }

  showHotspot (id) {
    if(this.scene.hotspots){
      var hotspot = this.scene.hotspots.find(function(hotspot){
        return id === hotspot.id;
      });

      if(hotspot) {
        this.ui.hotspot.html(window.JST['hotspot.html'](hotspot.content));
        this.ui.hotspot.find('.js-hotspot-close').on('click', this.closeHotspot);
      }
    }
  }

  closeHotspot (e) {
    e.preventDefault();
    this.ui.hotspot.empty();
  }
}

new VrView($('.js-vrview'));
