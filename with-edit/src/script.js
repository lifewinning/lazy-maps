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
var hellaCheat = new L.FeatureGroup();
map.addLayer(hellaCheat);
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
	circle: false,
	rectangle: false,
	marker: {icon: thisIcon}
},
// NO EDITING IN THIS BECAUSE I MADE AWFUL CHOICES I AM SORRY FOR WHAT I HAVE DONE
// edit: {
// 	featureGroup: drawnItems,
// 	remove: true
// }
});
map.addControl(drawControl);


map.on('draw:created', function (e) {
	var layer = e.layer;
	var layerType = e.layerType;
	var popupContent = '<div><h4>Item</h4><input id="type" name="type" value=""><h4>Notes</h4><textarea id="notes" name="notes" value=""></textarea><button id="add">Save</button></div>';
	
	//NO ONE SHOULD EVER WRITE CODE LIKE THIS IT IS HACKY AND THE WORST BUT IT DEMONSTRATES AN EXAMPLE ADEQUATELY
	hellaCheat.addLayer(layer).bindPopup(popupContent).openPopup();
	
	//save layer as geojson object by adding data to field
	if (layer = layer){
		L.DomUtil.get('add').onclick = function(){
		//layer is a geojson
			var geojson = layer.toGeoJSON();
		//layer needs to be re-styled when added back to the map	
			var style = {color: '#feb24c'};
		//add properties to geojson from popup
			geojson.properties["type"] = L.DomUtil.get("type").value;
			geojson.properties["notes"] = L.DomUtil.get("notes").value;
			//NEVER DO THIS EITHER THIS IS AWFUL
			var thisPopupContent = '<div><h4>Item</h4><input id="type" name="type" value='+JSON.stringify(geojson.properties["type"])+'>'+
			'<h4>Notes</h4><textarea id="notes" name="notes">'+geojson.properties["notes"]+
			'</textarea><button id="edit">Save</button></div>';
		//add geojson with stored properties to the map, removing the original layer 
			if (layerType !== 'marker'){
				L.geoJson(geojson, {style: style}).addTo(drawnItems).bindPopup(thisPopupContent);
				hellaCheat.clearLayers();
				console.log(drawnItems);
			} else {
				L.geoJson(geojson, { pointToLayer: function (feature, latlng) {
					return L.marker(latlng, {icon: thisIcon});
				}
				}).addTo(drawnItems).bindPopup(thisPopupContent);
				hellaCheat.clearLayers();		
			}
			stringy = JSON.stringify(geojson);
			things.push(stringy);
			console.log("geojson" + things);
		}
	}
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
//extremely hacky thing to make an array do a thing I need
	var magic = '{"type": "FeatureCollection","features": ['+things+']}'
	var blob = new Blob([magic], {type: 'text/plain;charset=utf-8'});
	saveAs(blob, 'map.geojson');
};