'use strict';

import $ from 'jquery';
import ejs from 'ejs';
import timeago from 'timeago';

class ContactMap {
  constructor($el) {
    if($el.length === 0) {
      return;
    }

    this.ui = {
      el: $el.get(0)
    };

    this.placeId = $el.attr('data-place-id');
    this.initMap = this.initMap.bind(this);
    this.center = {
      lat: $el.attr('data-lat'),
      lng: $el.attr('data-lng')
    }
    this.zoom = parseInt($el.attr('data-zoom'));

    this.initMap();
  }

  initMap() {
    var map = new google.maps.Map(this.ui.el, {
      center: new google.maps.LatLng(this.center.lat, this.center.lng),
      zoom: this.zoom,
      mapTypeId: 'terrain',
      scrollwheel: false,
      styles: [{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"labels.text","stylers":[{"visibility":"on"},{"color":"#8e8e8e"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#7f7f7f"}]},{"featureType":"administrative","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"administrative.country","elementType":"geometry.stroke","stylers":[{"color":"#bebebe"}]},{"featureType":"administrative.province","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#cbcbcb"},{"weight":"0.69"}]},{"featureType":"administrative.locality","elementType":"geometry","stylers":[{"visibility":"simplified"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#e4e4e4"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45},{"visibility":"simplified"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"},{"color":"#dadada"}]},{"featureType":"road.highway","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"labels.text","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"labels.text","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#eeeeee"}]},{"featureType":"road.local","elementType":"labels.text","stylers":[{"visibility":"simplified"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#cbcbcb"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#d9d9d9"}]},{"featureType":"water","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text","stylers":[{"visibility":"simplified"}]}]
    });

    var infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);

    service.getDetails({
      placeId: this.placeId
    }, function(place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });
        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent('<h1>' + place.name + '</h1>' + place.adr_address);
          infowindow.open(map, this);
        });
        google.maps.event.trigger(marker, "click");

      }
    });
  }
}

new ContactMap($('.js-contact-map'));
