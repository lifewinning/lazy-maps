var	map = new L.Map('map', {maxZoom:20});
var toner = new L.StamenTileLayer("toner-lite")
map.addLayer(toner);
map.locate({setView: true, minZoom: 20, maxZoom: 22});

//you are here
function onLocationFound(e) {
    var radius = e.accuracy / 2;

    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point");

    //L.circle(e.latlng, radius).addTo(map);
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
		allowIntersection: false,
		showArea: true,
		drawError: {
			color: '#feb24c',
			timeout: 1000
		},
		shapeOptions: {
			color: '#feb24c'
		}
	},
	marker: true
},
edit: {
	featureGroup: drawnItems,
	remove: true
}
});
map.addControl(drawControl);

map.on('draw:created', function (e) {
	var layer = e.layer;
	var layers = e.layers;
	layerID = Math.floor(Math.random()*666);
	//drawnItems.addLayer(layer);
	//push new layer to array
	var geojson = layer.toGeoJSON();
	drawnItems.addLayer(geojson);
	geojson.properties["id"] = layerID;
	geojson.properties["notes"] = 
	stringy = JSON.stringify(geojson);
	things.push(stringy);
	//console.log(things);
});
map.on('draw:edited', function(e){
	var layer = e.layer;
	var layers = e.layers;
	var things = [];
	layers.eachLayer(function(){
	var geojson = layer.toGeoJSON();
		geojson.properties["id"] = layerID;
		stringy = JSON.stringify(geojson);
		things.push(stringy);
	});

});


L.DomUtil.get('toGeoJSON').onclick = function() {
//extremely hacky thing to make an array do a thing I need
	var magic = '{"type": "FeatureCollection","features": ['+things+']}'
	var blob = new Blob([magic], {type: 'text/plain;charset=utf-8'});
	saveAs(blob, 'map.geojson');
};