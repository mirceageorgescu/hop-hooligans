'use strict';

import $ from 'jquery';
import ejs from 'ejs';

class Reviews {
  constructor($el) {
    if($el.length === 0) {
      return;
    }

    this.$el = $el;

    this.getReviews = this.getReviews.bind(this);
    this.beerId = $el.attr('data-untappd-id');

    this.getReviews('https://api.untappd.com/v4/beer/info/' + this.beerId + '/media/recent');
  }

  getReviews (url) {
    var bg = this.$el.attr('data-bg');
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

        // console.log(data.response.beer.checkins.items);

        if(data.meta.code === 200){
          self.$el.html(window.JST['review.html']({
            data: data,
            bg: bg,
            locals: locals
          }));

          //init timeago
          $("time.timeago").timeago();
        } else {
          self.$el.html(window.JST['review-error.html']({
            bg: bg,
            error: data.meta.error_detail
          }));
        }
      },
      error: function(data) {
        self.getReviews('/fallback-api/' + self.beerId + '.json');
      }

    });
  }
}

new Reviews($('.js-reviews'));
