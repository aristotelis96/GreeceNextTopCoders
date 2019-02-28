var app = angular.module('search', []);

app.controller('search', function ($scope) {
  $scope.mapHide = true;
  $scope.mapError = true;
  $scope.categories = categories;


  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPositionOnMap, hideMap);
    } else {
      //if not supported hidemap
      hideMap();
    }
  }

  function showPositionOnMap(position) {
    /* Initialize Map */
    position = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    }
    var map = new google.maps.Map(document.getElementById("map"), {
      zoom: 14,
      center: position
    })
    var marker = new google.maps.Marker({
      position: position,
      map: map
    });;
    $scope.$apply(function () {
      $scope.positionLng = position.lng;
      $scope.positionLat = position.lat;
      $scope.mapHide = false;
      $scope.distanceDisplay = 10;
    }); 
  }
  function hideMap() {
    $scope.$apply(function () {
      $scope.mapHide = true;
      $scope.mapError = false;
    }); 
  }  
  $scope.getLocation = getLocation;

  $scope.slider = function (){
    $scope.distanceDisplay = $scope.slideValue;
  }
})