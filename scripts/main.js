function getColor(e){return"-"===e?"#808080":"<5"===e?"#4caf45":e>=50?"#ab0635":e>=35?"#e9841d":e>=20?"#fbe0c7":e>=10?"#bedcb3":e>=0?"#4caf45":"#eaeaea"}function getSeverity(e){return"-"===e?"No data":"<5"===e?"Low":e>=50?"Extremely alarming":e>=35?"Alarming":e>=20?"Serious":e>=10?"Moderate":e>=0?"Low":"Not calculated"}$(document).foundation(),function(e,o,t,r){"use strict";function a(e){return{fillColor:getColor(e.properties.score),weight:e.properties.score?1:0,opacity:.3,color:"white",dashArray:"",fillOpacity:e.properties.score?.7:0}}function n(e){var o=e.target;o.setStyle({weight:5,color:"white",dashArray:"",fillOpacity:.7}),t.Browser.ie||t.Browser.opera||o.bringToFront()}function i(e){l.resetStyle(e.target)}function c(e,o){var t;t="nc"!==e.properties.score?"<h4>"+e.properties.name+"</h4> <p>Score: <strong>"+e.properties.score+"</strong></p> <p>Level: <strong>"+getSeverity(e.properties.score)+'</strong></p> <p><a class="button small radius" href="/countries/'+e.id+'">Find out more</a></p>':"<h4>"+e.properties.name+"</h4> <p>Score: <strong> Not calculated</p>",o.bindPopup(t,{autopan:!0}),o.on({mouseover:n,mouseout:i}),o._leaflet_id=e.id}t.Icon.Default.imagePath="images/";var s=t.map("map",{center:[52.5377,13.3958],scrollWheelZoom:!1,boxZoom:!1,zoom:4});new t.tileLayer("http://a{s}.acetate.geoiq.com/tiles/acetate-base/{z}/{x}/{y}.png",{subdomains:"0123",minZoom:0,maxZoom:18}).addTo(s);var l;t.control();l=new t.GeoJSON.AJAX("data/countrydata-2015.geo.json",{style:a,onEachFeature:c}),l.addTo(s),$(o).ready(function(){$("#country-table tbody").on("click","tr",function(e){var o=l.getLayer(this.id);s.setView(o.getBounds().getCenter()),o.openPopup()}),$("#year-drop li a").click(function(e){var o=this.className;l.clearLayers(),l=new t.GeoJSON.AJAX("data/countrydata-"+o+".geo.json",{style:a,onEachFeature:c}),l.addTo(s),$("#year-button").text(o)})})}(window,document,L);