var osmUrl = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png',
	osmAttrib = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
	osm = L.tileLayer(osmUrl, {maxZoom: 20, attribution: osmAttrib})
var map = new L.Map('map', {layers: [osm], center: new L.LatLng(40.7809,-73.9789), zoom: 12 });

var thisIcon = L.MakiMarkers.icon({icon:'star-stroked', color: "#feb24c", size: "s"});

var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
// Set the title to show on the polygon button
L.drawLocal.draw.toolbar.buttons.polygon = 'Polygons!';

//set draw controls
var drawControl = new L.Control.Draw({
position: 'topright',
draw: {
	polyline: {
		metric: true,
		shapeOptions:{
			color: '#feb24c',
			opacity: 0.8
		}
	},
	polygon: {
		allowIntersection: true,
		showArea: true,
		drawError: {
			color: '#feb24c',
			timeout: 1000
		},
		shapeOptions: {
			color: '#feb24c'
		}
	},
	circle: {
		
	},
	rectangle: {

	},
	marker: {icon: thisIcon}
},
edit: {
	featureGroup: drawnItems,
	remove: true
}
});
map.addControl(drawControl);

map.on('draw:created', function (e) {
	var layer = e.layer;
	var layerType = e.layerType;
	drawnItems.addLayer(layer);
});
map.on('draw:edited', function (e) {
	var layers = e.layers;
	var countOfEditedLayers = 0;
	layers.eachLayer(function(layer) {
		countOfEditedLayers++;
	});
	console.log("Edited " + countOfEditedLayers + " layers");
});
map.on('draw:deleted', function (e) {
	var layers = e.layers;
	var deletedLayers = 0; 
	layers.eachLayer(function(layer){
		deletedLayers++;
	});
	console.log("Deleted "+ deletedLayers + " layers");
})


L.DomUtil.get('toGeoJSON').onclick = function() {
	magic = JSON.stringify(drawnItems.toGeoJSON());
	var blob = new Blob([magic], {type: 'text/plain;charset=utf-8'});
	saveAs(blob, 'map.geojson');
};