var	map = new L.Map('map', {zoom: 18});
var toner = new L.StamenTileLayer("toner-lite")
map.addLayer(toner);
map.locate({setView: true, maxZoom: 22});

var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

// Set the title to show on the polygon button
L.drawLocal.draw.toolbar.buttons.polygon = 'Polygons!';

var drawControl = new L.Control.Draw({
position: 'topright',
draw: {
	polyline: {
		metric: true,
		shapeOptions:{
			color: '#feb24c'
		}
	},
	polygon: {
		allowIntersection: false,
		showArea: true,
		drawError: {
			color: '#b00b00',
			timeout: 1000
		},
		shapeOptions: {
			color: '#bada55'
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
	var layerID = Math.floor(Math.rand()*666);
	var content = '<label>Type:</label><input type="text" id="type" /><br/><label>Notes:</label><textarea  id="notes" columns="225"></textarea><br/><label>Image:</label><input type="file" id="picture"><br/><button id="save">Save</button>'
	layer.bindPopup(content);
	drawnItems.addLayer(layer);
	L.DomUtil.get('save').onclick = function(){
		console.log (layerID);
		sessionStorage.type = L.DomUtil.get('type').value;
		sessionStorage.notes = L.DomUtil.get('notes').value;
		//images
		var fileInput = L.DomUtil.get('picture');
		fileInput.addEventListener('change', function(e) {
			//image upload
			var file = fileInput.files[0];
			var imageType = /image.*/;

			if (file.type.match(imageType)) {
				var reader = new FileReader();
				reader.onload = function(e) {
					fileDisplayArea.innerHTML = "";

					// Create a new image.
					var img = new Image();
					// Set the img src property using the data URL.
					img.src = reader.result;
				}
				var imgBase = reader.readAsDataURL(file); 
				console.log(imgBase);''
				sessionStorage.img = imgBase;
			} else {
				console.log("This should be an image! :/");
			}
			});
	}
});

map.on('draw:edited', function (e) {
	var layers = e.layers;
	var countOfEditedLayers = 0;
	layers.eachLayer(function(layer) {
		countOfEditedLayers++;
	});
});

//store form data in sesslion
// function formdata(e) {
//    var text = document.getElementById('input-text');
//    text.addEventListener('keyup', function () {
//        sessionStorage.text = text.value;
//    }, false);
//    console.log(text);
// }

// function toGeoJSON(e){
// 	var obj = JSON.stringify(e.toGeoJSON());
// 	obj.eachLayer( function{
// 		type = L.DomUtil.get('type').value;
// 		notes= L.DomUtil.get('notes').value;
		
// 		fileInput = L.DomUtil.get('picture');
// 		var fileDisplayArea = L.DomUtil.get('pictureDisplay');

// 		obj.push(features);  
// 	})

// }

// marker.on('dragend', function(e) {
//     marker.openPopup();
//     // When the user clicks Add
//     L.DomEvent.addListener(L.DomUtil.get('add-button'), 'click', function() {
//         // First, clean the potential-HTML they've added to the value.
//         var message = L.DomUtil.get('message').value;
//         // Get the current draggable marker's position and GeoJSON representation
//         var geojson = marker.toGeoJSON();
//         geojson.properties['marker-color'] = color;
//         geojson.properties.title = message;
//         // And save it to Firebase
//         base.push(geojson);
//         marker.closePopup();
//     });
// });

// fileInput.addEventListener('change', function(e) {
// 	//image upload
// 	var file = fileInput.files[0];
// 	var imageType = /image.*/;

// 	if (file.type.match(imageType)) {
// 		var reader = new FileReader();

// 		reader.onload = function(e) {
// 			fileDisplayArea.innerHTML = "";

// 			// Create a new image.
// 			var img = new Image();
// 			// Set the img src property using the data URL.
// 			img.src = reader.result;

// 			// Add the image to the page.
// 			fileDisplayArea.appendChild(img);
// 		}
// 		reader.readAsDataURL(file); 
// 	} else {
// 		fileDisplayArea.innerHTML = "This should be an image! :/";
// 	}
// });


L.DomUtil.get('toGeoJSON').onclick = function() {
var obj = JSON.stringify(drawnItems.toGeoJSON());
var blob= new Blob([obj], {type: 'text/plain;charset=utf-8'});
saveAs(blob, idTime+'.geojson');
};