!function(t,a,e,o){"use strict";e.Icon.Default.imagePath="images/";var n=e.map("map",{center:[52.5377,13.3958],zoom:4});new e.tileLayer("http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png",{minZoom:0,maxZoom:18,attribution:'Map data © <a href="http://www.openstreetmap.org">OpenStreetMap contributors</a>'}).addTo(n);var m=new e.GeoJSON.AJAX("data/mockdata.geo.json");m.addTo(n)}(window,document,L);