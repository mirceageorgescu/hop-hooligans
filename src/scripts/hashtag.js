'use strict';

import $ from 'jquery';
import ejs from 'ejs';
import timeago from 'timeago';

class Hashtag {
  constructor($el) {
    if($el.length === 0) {
      return;
    }

    $.ajax({
      url: 'https://api.untappd.com/v4/brewery/checkins/268580',
      dataType: 'json',
      type: 'GET',
      data: {
        client_id: window.locals.reviews.api.client_id,
        client_secret: window.locals.reviews.api.client_secret,
        limit: window.locals.reviews.api.limit
      },
      success: function(data){

        if(data.meta.code === 200){
          $el.html(window.JST['hashtag.html']({
            data: data,
            locals: locals
          }));


          //init timeago
          $("time.timeago").timeago();
        } else {
          $el.html(window.JST['hashtag.html']({
            locals: locals,
            error: meta.error_message
          }));
        }

      },
      error: function(data) {
        $el.html(window.JST['hashtag-error.html']({
          locals: locals,
          error: JSON.parse(data.responseText).meta.error_detail
        }));
      }
    });
  }
}

new Hashtag($('.js-hashtag'));
