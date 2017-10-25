'use strict';

import $ from 'jquery';
import ejs from 'ejs';

class Singing {
  constructor($el) {
    if($el.length === 0) {
      return;
    }

    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.trigger = this.trigger.bind(this);

    //add audio element
    $('body').append('<audio id="singing-ship" src="/audio/singing-ship.mp3"></audio>');

    this.state = { playing: false }

    this.ui = {
      $el: $el,
      $trigger: $el.find('.product__image'),
      player: document.getElementById("singing-ship"),
      title: $el.find('.product__title'),
      wrapper: $el.find('.js-colored')
    }

    //toggle on click
    this.ui.$trigger.on('click', this.trigger);
  }

  trigger() {
    this.state.playing ? this.pause() : this.play();
  }

  play() {
    console.log('play')
    this.state.playing = true;
    this.ui.player.play();
    this.ui.title.html('Singing Ship');
    this.ui.$el.addClass('is-singing');
  }

  pause() {
    console.log('pause')
    this.state.playing = false;
    this.ui.player.pause();
    this.ui.title.html('Sinking Ship');
    this.ui.$el.removeClass('is-singing');
  }
}

new Singing($('.product--sinking-ship'));
