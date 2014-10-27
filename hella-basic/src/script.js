var	map = new L.Map('map', {maxZoom:20});
var toner = new L.StamenTileLayer("toner-lite")
map.addLayer(toner);
map.locate({setView: true, minZoom: 20, maxZoom: 22});

var thisIcon = L.MakiMarkers.icon({icon:'star-stroked', color: "#feb24c", size: "s"});
//you are here
function onLocationFound(e) {

	var youAreHere = L.MakiMarkers.icon({color: "#2FBD57", size: "s"})
    var radius = e.accuracy / 2;

    L.marker(e.latlng, {icon: youAreHere}).addTo(map).bindPopup("You are approximately here");
}

map.on('locationfound', onLocationFound);

//all the things are being stored here
var things = [];

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
	drawnItems.addLayer(layer).bindPopup(popupContent).openPopup();
});
map.on('draw:edited', function (e) {
	var layers = e.layers;
	var countOfEditedLayers = 0;
	layers.eachLayer(function(layer) {
		countOfEditedLayers++;
	});
	console.log("Edited " + countOfEditedLayers + " layers");
});


L.DomUtil.get('toGeoJSON').onclick = function() {
	magic = JSON.stringify(drawnItems.toGeoJSON());
	var blob = new Blob([magic], {type: 'text/plain;charset=utf-8'});
	saveAs(blob, 'map.geojson');
};