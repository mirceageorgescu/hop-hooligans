'use strict';

import $ from 'jquery';
import ejs from 'ejs';

class Hashtag {
  constructor($el) {
    if($el.length === 0) {
      return;
    }

    $.ajax({
      url: 'https://api.instagram.com/v1/tags/' + window.locals.hashtag.hashtag + '/media/recent',
      dataType: 'jsonp',
      type: 'GET',
      data: {access_token: window.locals.hashtag.token, count: window.locals.hashtag.limit},
      success: function(data){

        if(data.meta.code === 200){
          $el.html(window.JST['hashtag.html']({
            data: data,
            locals: locals
          }));
        } else {
          $el.html(window.JST['hashtag.html']({
            locals: locals,
            error: meta.error_message
          }));
        }

      }
    });
  }
}

new Hashtag($('.js-hashtag'));
