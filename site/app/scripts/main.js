// Foundation JavaScript
$(document).foundation();

/*jslint browser: true*/
/*global L */

function getColor(d) {
  if (d === '-') { return '#808080'; }
  if (d === '<5') { return '#4caf45'; }
  return d >= 50 ? '#ab0635' :
    d >= 35  ? '#e9841d' :
    d >= 20  ? '#fbe0c7' :
    d >= 10  ? '#bedcb3' :
    d >= 0   ? '#4caf45' :
    '#eaeaea';
}

function getSeverity(d) {
  if (d === '-') { return 'No data'; }
  if (d === '<5') { return 'Low'; }
  return d >= 50 ? 'Extremely alarming' :
    d >= 35  ? 'Alarming' :
    d >= 20  ? 'Serious' :
    d >= 10  ? 'Moderate' :
    d >= 0   ? 'Low' :
    'Not calculated';
}



(function (window, document, L, undefined) {
  'use strict';

  L.Icon.Default.imagePath = 'images/';

  /* create leaflet map */
  var map = L.map('map', {
    center: [52.5377, 13.3958],
    scrollWheelZoom: false,
    boxZoom: false,
    zoom: 4
  });

  new L.tileLayer('http://a{s}.acetate.geoiq.com/tiles/acetate-base/{z}/{x}/{y}.png', {
      subdomains: '0123',
      minZoom: 0,
      maxZoom: 18
      }).addTo(map);

  var info = L.control();
  var geojsonLayer;

  function style(feature) {
    return {
      fillColor: getColor(feature.properties.score.year2015),
      weight: feature.properties.score.year2015 ? 1 : 0,
      opacity: 0.3,
      color: 'white',
      dashArray: '',
      fillOpacity: feature.properties.score.year2015 ? 0.7 : 0
    };
  }

  // Interaction logic from https://jsfiddle.net/eaj6h/11/
  function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
      weight: 5,
      color: 'white',
      dashArray: '',
      fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera) {
      layer.bringToFront();
    }

    // info.update(layer.feature.properties);
  }


  function resetHighlight(e) {
    geojsonLayer.resetStyle(e.target);
    // info.update();
  }

  function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
  }

  function onEachFeature(feature, layer) {

    // set up popups
    var popupContent;
    if (feature.properties.score.year2015 !== 'nc') {
      popupContent = '<h4>' + feature.properties.name + '</h4> <p>Score: <strong>' + feature.properties.score.year2015 + '</strong></p> <p>Level: <strong>' + getSeverity(feature.properties.score.year2015) + '</strong></p> <p><a class="button small radius" href="/countries/' + feature.id + '">Find out more</a></p>';
    } else {
      popupContent = '<h4>' + feature.properties.name + '</h4> <p>Score: <strong> Not calculated</p>';
    }



    layer.bindPopup(popupContent, {autopan: true});
    // set up mouseover highlights
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
    });
    // make features accessible by id
    // https://stackoverflow.com/a/28618177
    layer._leaflet_id = feature.id;
  }

  // https://gis.stackexchange.com/a/102125
  geojsonLayer = new L.GeoJSON.AJAX('data/countrydata.geo.json', {
    style: style,
    onEachFeature: onEachFeature
  });       
  geojsonLayer.addTo(map);

  $(document).ready(function() {
    $('#country-table tbody').on( 'click', 'tr', function (ev) {
      var f = geojsonLayer.getLayer(this.id);
      map.setView(f.getBounds().getCenter());
      f.openPopup();
    } );

  } );




}(window, document, L));

