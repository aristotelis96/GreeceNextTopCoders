var zooming;
var shopmarker;
/* Create Map */
var map = new google.maps.Map(document.getElementById("map"));
/* Array of Markers */
var markers = [];
/* Info window for markers */
var infowindow = new google.maps.InfoWindow();
/* Create each marker and place on map */
result.forEach(element => {
        if (element.shopLat != null && element.shopLng != null) {        
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(element.shopLat, element.shopLng),
            map: map
        });
        /* Push into Markers array */
        markers.push(marker);
        /* Add event listener for Info PoP up for each marker */
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
              infowindow.setContent("<a href='/shopPage/" + element.shopId + "'>" + element.shopName + "</a>");
              infowindow.open(map, marker);
            }
          })(marker, i));
    }
})

/* Last fix zoom of map to fit all markers. */ 
var bounds = new google.maps.LatLngBounds();
for (var i = 0; i < markers.length; i++) {
    bounds.extend(markers[i].getPosition());
}
/* If only 1 marker is available set Zoom to 15 else fit bounds*/
console.log(markers.length);
if(markers.length == 1){
    map.setCenter(bounds.getCenter());
    map.setZoom(15);
}
else
    map.fitBounds(bounds);
