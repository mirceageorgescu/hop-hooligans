'use strict';

import $ from 'jquery';
import ejs from 'ejs';

class Reviews {
  constructor($el) {
    if($el.length === 0) {
      return;
    }

    $.ajax({
      url: 'https://api.untappd.com/v4/beer/info/' + $el.attr('data-untappd-id') + '/media/recent',
      dataType: 'json',
      type: 'GET',
      data: {
        client_id: window.locals.reviews.api.client_id,
        client_secret: window.locals.reviews.api.client_secret
      },
      success: function(data){

        // console.log(data.response.beer.checkins.items);

        if(data.meta.code === 200){
          $el.html(ejs.render('<div class="card-deck"><% var comments = 0; response.beer.checkins.items.forEach(function(item){ %><% if(item.checkin_comment) { comments = comments + 1; %><div class="card"><div class="card-block"><% if (item.rating_score >= 1) { %><h1 class="card-title"><%= item.rating_score %> / 5</h1><% } else { %><h1 class="card-title">No rating</h1><% } %><p class="card-text"><%=item.checkin_comment %></p></div><div class="card-footer"><a href="https://untappd.com/user/<%= item.user.user_name %>/checkin/<%= item.checkin_id %>" target="_blank"><%=item.user.first_name %> <%=item.user.last_name %></a></div></div><% } %><% }) %></div> <% if (comments === 0) { %><div>This is so fucking new it has no reviews.</div><% } else { %> <a href="https://untappd.com/b/<%= response.beer.beer_slug %>/<%= response.beer.bid %>" target="_blank" class="btn btn-lg btn-primary btn-uppercase mt-2">Read more reviews</a> <% } %>', data));
        } else {
          $el.html(data.meta.error_detail);
        }
      },
      error: function(data) {
        $el.html(JSON.parse(data.responseText).meta.error_detail);
      }

    });
  }
}

new Reviews($('.js-reviews'));
