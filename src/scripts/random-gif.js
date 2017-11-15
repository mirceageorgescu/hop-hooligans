'use strict';

import $ from 'jquery';
import ejs from 'ejs';
import timeago from 'timeago';

class RandomGif {
  constructor($el) {
    if($el.length === 0) {
      return;
    }

    this.getRandomInt = this.getRandomInt.bind(this);

    this.ui = {
      el: $el
    };

    this.gifs = $el.attr('data-gifs').split(',');

    this.addGif();
  }

  addGif() {
    var url = this.gifs[this.getRandomInt(0, this.gifs.length - 1)]

    this.ui.el.attr({'src': url });
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    //The maximum is inclusive and the minimum is inclusive
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

new RandomGif($('.js-random-gif'));
