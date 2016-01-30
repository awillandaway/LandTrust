
var currentLocation = new L.LatLng(41.8193203, -72.2511833); //initialized with test value at uconn
var markerCounter = 0;
var firstLocate = true;

L.mapbox.accessToken = 'YOUR_API_KEY';
var map = L.mapbox.map('map', 'mapbox.streets', { zoomControl: false })
    .setView(currentLocation, 14);

var runLayer = omnivore.kml('doc.kml')
    .on('ready', function() {
        map.fitBounds(runLayer.getBounds());
        runLayer.eachLayer(function(layer) {
            // See the `.bindPopup` documentation for full details. This
            // dataset has a property called `name`: your dataset might not,
            // so inspect it and customize to taste.
            var content = '<h2>' + layer.feature.properties.name + '</h2>' +
                    '<p>' + layer.feature.properties.description + '</p>';
            layer.bindPopup(content);
        });
    })
    .addTo(map);

var polyline = L.polyline(currentLocation, {color: 'red'}).addTo(map);
var addMarker = function() {
    L.marker(currentLocation).addTo(map)
        .bindPopup("Marker " + markerCounter).openPopup();
    markerCounter++;
    polyline.addLatLng(currentLocation);
}

var beginTrack = function() {
    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);
    map.locate({watch: true, setView: true, maxZoom: 16});
}

var onLocationFound = function(e) {
    if(firstLocate) {
        var currentLocationMarker = L.marker(e.latlng).addTo(map)
            .bindPopup("You are at " + e.latlng).openPopup();
        var currentLocationCircle = L.circle(e.latlng, e.accuracy / 2).addTo(map);
        firstLocate = false;
    }
    currentLocation = e.latlng;
    currentLocationMarker.setLatLng(e.latlng); 
    currentLocationCircle.setLatLng(e.latlng);
    currentLocationCircle.setRadius(e.accuracy / 2);
}

var onLocationError = function(e) {
    alert(e.message);
}



// L.control.locate({position: 'bottomleft', watch: true, setView: true, maxZoom: 16}).addTo(map);