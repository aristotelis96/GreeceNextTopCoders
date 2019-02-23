var zooming;
var shopmarker;

if (lati == null || lang == null) {

    shopmarker = {
        lat: 37.983810,
        lng: 23.727539
    };
    zooming = 6;
} else {
    shopmarker = {
        lat: lati,
        lng: lang
    };
    zooming = 15;
}

console.log(shopmarker);
var map = new google.maps.Map(document.getElementById("map"), {
    zoom: zooming,
    center: shopmarker
});
if (lati != null && lang != null) {
    var marker = new google.maps.Marker({
        position: shopmarker,
        map: map
    });
}  

