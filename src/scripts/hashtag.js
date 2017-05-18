'use strict';

import $ from 'jquery';
import ejs from 'ejs';
import timeago from 'timeago';

class Hashtag {
  constructor($el) {
    if($el.length === 0) {
      return;
    }

    this.$el = $el;

    this.getPhotos = this.getPhotos.bind(this);

    this.getPhotos('https://api.untappd.com/v4/brewery/checkins/268580');
  }

  getPhotos (url) {
    var self = this;

    $.ajax({
      url: url,
      dataType: 'json',
      type: 'GET',
      data: {
        client_id: window.locals.reviews.api.client_id,
        client_secret: window.locals.reviews.api.client_secret,
        limit: window.locals.reviews.api.limit
      },
      success: function(data){

        if(data.meta.code === 200){
          self.$el.html(window.JST['hashtag.html']({
            data: data,
            locals: locals
          }));

          //init timeago
          $("time.timeago").timeago();
        } else {
          self.$el.html(window.JST['hashtag.html']({
            locals: locals,
            error: meta.error_message
          }));
        }
      },
      error: function(data) {
        self.getPhotos('/fallback-api/268580.json');
      }
    });
  }
}

new Hashtag($('.js-hashtag'));
