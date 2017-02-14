'use strict';

import $ from 'jquery';
import ejs from 'ejs';
import timeago from 'timeago';

class Beermap {
  constructor($el) {
    if($el.length === 0) {
      return;
    }

    this.ui = {
      el: $el.get(0)
    };

    this.initMap = this.initMap.bind(this);
    this.loadKmlLayer = this.loadKmlLayer.bind(this);
    this.updateMap = this.updateMap.bind(this);

    $('.js-cities-item').on('click', this.updateMap);

    this.initMap();
  }

  initMap() {
    console.log('init');

    this.map = new google.maps.Map(this.ui.el, {
      center: new google.maps.LatLng($('.js-cities-item.btn-warning').attr('data-lat'), $('.js-cities-item.btn-warning').attr('data-lng')),
      zoom: 14,
      mapTypeId: 'terrain',
      scrollwheel: false,
      styles: [{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"labels.text","stylers":[{"visibility":"on"},{"color":"#8e8e8e"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#7f7f7f"}]},{"featureType":"administrative","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"administrative.country","elementType":"geometry.stroke","stylers":[{"color":"#bebebe"}]},{"featureType":"administrative.province","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#cbcbcb"},{"weight":"0.69"}]},{"featureType":"administrative.locality","elementType":"geometry","stylers":[{"visibility":"simplified"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#e4e4e4"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45},{"visibility":"simplified"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"},{"color":"#dadada"}]},{"featureType":"road.highway","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"labels.text","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"labels.text","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#eeeeee"}]},{"featureType":"road.local","elementType":"labels.text","stylers":[{"visibility":"simplified"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#cbcbcb"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#d9d9d9"}]},{"featureType":"water","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text","stylers":[{"visibility":"simplified"}]}]
    });


    this.loadKmlLayer('https://www.google.com/maps/d/u/0/kml?forcekmz=1&mid=1q4wGm78jotpdx7ssEhOQbYiwGgk', this.map);
  }

  loadKmlLayer(src, map) {
    // console.log(src);
    this.kmlLayer = new google.maps.KmlLayer(src, {
      suppressInfoWindows: false,
      preserveViewport: true,
      map: map,
      scrollwheel: false
    });

    google.maps.event.addListener(this.kmlLayer, 'click', function(event) {
      // console.log(event);
      // var content = event.featureData.infoWindowHtml;
      // var testimonial = document.getElementById('capture');
      // testimonial.innerHTML = content;
    });

    // console.log(this.kmlLayer);
  }

  updateMap(e) {
    e.preventDefault();

    var $el = $(e.currentTarget),
      position = {
        lat: parseFloat($el.attr('data-lat')),
        lng: parseFloat($el.attr('data-lng'))
      };

      // console.log(position);

    this.map.panTo(position);

    $('.js-cities-item').removeClass('btn-warning').addClass('btn-primary');
    $el.addClass('btn-warning');
  }
}

new Beermap($('.js-beermap'));
