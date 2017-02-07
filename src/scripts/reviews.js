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
        client_secret: window.locals.reviews.api.client_secret
      },
      success: function(data){

        // console.log(data.response.beer.checkins.items);

        if(data.meta.code === 200){
          $el.html(ejs.render('<div class="card-deck"><% var comments = 0; response.beer.checkins.items.forEach(function(item){ %><% if(item.checkin_comment) { comments = comments + 1; %><div class="card card-inverse" style="background-color: ' + bg + '; border-color: ' + bg + ';"><div class="card-block"><% if (item.rating_score >= 1) { %><h1 class="card-title"><%= item.rating_score %> / 5</h1><% } else { %><h1 class="card-title">No rating</h1><% } %><p class="card-text"><em><%=item.checkin_comment %></em></p></div><div class="card-footer"><a href="https://untappd.com/user/<%= item.user.user_name %>/checkin/<%= item.checkin_id %>" target="_blank"><%=item.user.first_name %> <%=item.user.last_name %></a></div></div><% } %><% }) %></div> <% if (comments === 0) { %><div class="card-deck"><div class="card card-inverse" style="background-color: ' + bg + '; border-color: ' + bg + ';"><div class="card-block"><p class="card-text">This is so fucking new it has no reviews.</p></div></div></div><% } else { %> <a href="https://untappd.com/b/<%= response.beer.beer_slug %>/<%= response.beer.bid %>" target="_blank" class="btn btn-lg btn-primary btn-sm-block btn-more btn-uppercase">Read more reviews</a> <% } %>', data));
        } else {
          $el.html('<div class="card-deck"><div class="card card-inverse" style="background-color: ' + bg + '; border-color: ' + bg + ';"><div class="card-block"><p class="card-text">' + data.meta.error_detail + '</p></div></div></div>');
        }
      },
      error: function(data) {
        $el.html('<div class="card-deck"><div class="card card-inverse" style="background-color: ' + bg + '; border-color: ' + bg + ';"><div class="card-block"><p class="card-text">' + JSON.parse(data.responseText).meta.error_detail + '</p></div></div></div>');
      }

    });
  }
}

new Reviews($('.js-reviews'));
