
$(document).on('ready',function () {
	// Initialize the map on the "map" div
	var map = new L.Map('map');
	// Create a CloudMade tile layer with style #997 (or use other provider of your choice)
	var cloudmade = new L.TileLayer('http://a.tiles.mapbox.com/v3/examples.map-4l7djmvo/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, Imagery © <a href="http://mapbox.com/">MapBox</a>',minZoom: 14, maxZoom: 19
	});

	 ///map/lima

	map.addLayer(cloudmade).setView(new L.LatLng(-12.04157,  -77.05688), 12);
	map.on('click', onMapClick);
	var popup = new L.Popup();
	
	function onMapClick(e) {
    var latlngStr = '(' + e.latlng.lat.toFixed(5) + ', ' + e.latlng.lng.toFixed(5) + ')';
	latlngStr="";
    popup.setLatLng(e.latlng);
    popup.setContent("<h6>Punto de Crítico</h6>" + latlngStr);
    map.openPopup(popup);
    //Here put the coordinates in field Latitud dan Longitud
	$('#entry_5').attr('value',  e.latlng.lat.toFixed(5));
    $('#entry_6').attr('value',  e.latlng.lng.toFixed(5));
	}


	$("#button").click(function(){
 var myurl = document.getElementById("entry_14");

   $('#entry_14').attr('value','http://dl.dropbox.com/u/43116811/basura/bas14.jpg');
		
	});

	


});
