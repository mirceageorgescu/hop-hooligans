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
          $el.html(ejs.render('<% data.forEach(function(item){ %><li class="col-6 col-sm-3 col-md-2 grid-b-m"><a href="<%=item.link %>" target="_blank" title="<%=item.caption.text %>" class="hashtag__link"><img data-src="<%=item.images.thumbnail.url %>" class="lazyload img--full"></a></li><% }) %>', data));
        } else {
          $el.html(ejs.render('<li class="col-12"><%= meta.error_message %></li>', data));
        }

      }
    });
  }
}

new Hashtag($('.js-hashtag'));
