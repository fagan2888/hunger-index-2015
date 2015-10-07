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

function getSeverityClass(d) {
  if (d === '-') { return 'no-data'; }
  if (d === '<5') { return 'low'; }
  return d >= 50 ? 'extra-alarming' :
    d >= 35  ? 'alarming' :
    d >= 20  ? 'serious' :
    d >= 10  ? 'moderate' :
    d >= 0   ? 'low' :
    'not-calculated';
}


(function (window, document, L, undefined) {
  'use strict';

  L.Icon.Default.imagePath = 'images/';

  /* create leaflet map */
  var map = L.map('map', {
    center: [32.5377, 13.3958],
    scrollWheelZoom: false,
    boxZoom: false,
    worldCopyJump: true,
    zoom: 2
  });

  new L.tileLayer('http://a{s}.acetate.geoiq.com/tiles/acetate-base/{z}/{x}/{y}.png', {
      subdomains: '0123',
      minZoom: 2,
      maxZoom: 18
      }).addTo(map);

  var info = L.control();
  var geojsonLayer;

  function style(feature) {
    return {
      fillColor: getColor(feature.properties.score),
      weight: feature.properties.score ? 1 : 0,
      opacity: 0.3,
      color: 'white',
      dashArray: '',
      fillOpacity: feature.properties.score ? 0.7 : 0
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
    if (feature.properties.score !== 'nc') {
      popupContent = '<h4>' + feature.properties.name + '</h4> <p>Score: <strong>' + feature.properties.score + '</strong></p> <p>Level: <strong>' + getSeverity(feature.properties.score) + '</strong></p> <p><a class="button small radius" href="countries/' + feature.id + '">Find out more</a></p>';
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
  geojsonLayer = new L.GeoJSON.AJAX('data/countrydata-2015.geo.json', {
    style: style,
    onEachFeature: onEachFeature
  });       
  geojsonLayer.addTo(map);

  // zoom on click
  // https://stackoverflow.com/a/24529886
  map.on('popupopen', function(centerMarker) {
          var cM = map.project(centerMarker.popup._latlng);
          cM.y -= centerMarker.popup._container.clientHeight/8
          map.setView(map.unproject(cM),2, {animate: true});
      });

  function populateTable(year) {
    // reload table
    $.getJSON( "data/countrydata-" + year + ".geo.json", function( data ) {
      var items = [];
      $('#country-table tbody').empty();
      $.each( data.features, function( key, c ) {
        if (c.properties.score !== 'nc' && c.properties.score !== '-') {
          $('<tr>').attr("id", c.id)
            .attr("class", getSeverityClass(c.properties.score))
            .attr("role", "row")
            .append(
                $('<td>').text(c.properties.name),
                $('<td>').text(c.properties.score)
                ).appendTo('#country-table');
        }
      });
    });

    $('#country-table tbody').on( 'click', 'tr', function (ev) {
      // clicking on a country in the table focuses the map on it
      console.log(this);
      var f = geojsonLayer.getLayer(this.id);
      map.setView(f.getBounds().getCenter());
      f.openPopup();
    });
  }

  $(document).ready(function() {
    populateTable('2015');

    $('#year-drop li a').click( function(ev) {
      // year dropdown refreshes map
      var year = this.className;
      geojsonLayer.clearLayers();geojsonLayer = new L.GeoJSON.AJAX('data/countrydata-' + year + '.geo.json', {
        style: style,
        onEachFeature: onEachFeature
      });       
      geojsonLayer.addTo(map);
      $('#year-button').text(year);
      populateTable(year);

    });
  });




}(window, document, L));

