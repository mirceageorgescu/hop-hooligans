'use strict';

import $ from 'jquery';
import ejs from 'ejs';

class Reviews {
  constructor($el) {
    if($el.length === 0) {
      return;
    }

    const bg = $el.attr('data-bg');

    $.ajax({
      url: 'https://api.untappd.com/v4/beer/info/' + $el.attr('data-untappd-id') + '/media/recent',
      dataType: 'json',
      type: 'GET',
      data: {
        client_id: window.locals.reviews.api.client_id,
        client_secret: window.locals.reviews.api.client_secret,
        limit: window.locals.reviews.api.limit
      },
      success: function(data){

        console.log(data.response.beer.checkins.items);

        if(data.meta.code === 200){
          $el.html(window.JST['review.html']({
            data: data,
            bg: bg,
            locals: locals
          }));
        } else {
          $el.html(window.JST['review-error.html']({
            bg: bg,
            error: data.meta.error_detail
          }));
        }
      },
      error: function(data) {
        $el.html(window.JST['review-error.html']({
          bg: bg,
          error: JSON.parse(data.responseText).meta.error_detail
        }));
      }

    });
  }
}

new Reviews($('.js-reviews'));
