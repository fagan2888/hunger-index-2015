/*jslint browser: true*/
/*global L */

function getColor(d) {
    if (d == '-') { return '#ccc' }
    if (d == '<5') { return '#FD8D3C' }
    return d > 30 ? '#800026' :
           d > 20  ? '#BD0026' :
           d > 10  ? '#E31A1C' :
           d > 5  ? '#FC4E2A' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.score),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

(function (window, document, L, undefined) {
	'use strict';

	L.Icon.Default.imagePath = 'images/';

	/* create leaflet map */
	var map = L.map('map', {
		center: [52.5377, 13.3958],
		zoom: 4
	});

	/* add default stamen tile layer */
	new L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
		minZoom: 0,
		maxZoom: 18,
		attribution: 'Map data © <a href="http://www.openstreetmap.org">OpenStreetMap contributors</a>'
	}).addTo(map);

        // https://gis.stackexchange.com/a/102125
        var geojsonLayer = new L.GeoJSON.AJAX('data/mockdata.geo.json', {style: style});       
        geojsonLayer.addTo(map);


}(window, document, L));
