var app = angular.module('Signup', []);

app.controller('signup', function ($scope, $http) {

    /*---------------- Map and Addresses Section -----------*/
    var map;
    var marker = null;
    /*Declare and create Map */

    var mapProp = {
        center: new google.maps.LatLng(37.983810, 23.727539),
        zoom: 9,
    };
    map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
    marker = new google.maps.Marker({
        position: { lat: 0, lng: 0 },
        map: map
    });
    google.maps.event.addListener(map, 'click', function (event) {
        /* Apply function needed ?? */
        $scope.$apply(function () {
            $scope.lng = event.latLng.lng(); $scope.lat = event.latLng.lat();
        });

        let positionmap = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());
        marker.setPosition(positionmap);

        /* Set address fields based on user input */
        $http.get(' https://eu1.locationiq.com/v1/reverse.php?key=1e7abcc58d0e64&lat=' + $scope.lat + '&lon=' + $scope.lng + '&format=json&accept-language=el&normalizecity=1').then((response) => {            
            let address = response.data.address;
            try {
                $scope.periferia = address.state_district.replace('Περιφέρεια ', ''); /* Geo location returns 'Περιφερεια .. ' , we need to remove that */
            } catch (e) {
                // do nothing. try/catch needed in case of undefined/null etc.
            }
            /* address contains fields city, street, streetNumber */
            $scope.poli = '';
            if (address.city != undefined) {
                $scope.poli = address.city;
                if($scope.poleis.findIndex(i => i.city === address.city) == -1) // add to dropdown cities if doesnt exist
                   $scope.poleis.push({ city: address.city });
                $scope.poleisDis = false; //make dropdown available to user
            }
            $scope.street = '';
            if (address.road != undefined) $scope.street += address.road;
            $scope.streetNumber = parseInt(address.house_number);
            if (isNaN($scope.streetNumber))
                $scope.streetNumber = ''; //If number was not found from api, leave field blank
        })
    });
    //load periferies and poleis
    $http.get('/addresses/periferies')
        .then((response) => {
            $scope.periferies = response.data;
        });

    $scope.poleisDis = true;
    $scope.poleis = [];
    //periferia and poleis functions
    periferiaSelected = function () {
        let periferia = $scope.periferia;
        $http.get('/addresses/poleis?periferia=' + periferia)
            .then((response) => {
                $scope.poleis = [];
                for (let i = 0; i < response.data.length; i++) {
                    $scope.poleis.push({ city: response.data[i].city })
                }
                $scope.poleisDis = false;
            });
    }
    $scope.periferiaSelected = periferiaSelected;

    poliSelected = function () {
        if ($scope.poli != null && $scope.poli != '') {
            $http.get('https://eu1.locationiq.com/v1/search.php?key=1e7abcc58d0e64&state=' + $scope.periferia + '&city=' + $scope.poli + '&format=json').then((response) => {
                map.setCenter((new google.maps.LatLng(response.data[0].lat, response.data[0].lon)));
                map.setZoom(13);
            })
        }
    }

    /* Geo location based on typed address */
    geoLocate = function () {
        if ($scope.streetNumber == '' || $scope.streetNumber == null || $scope.street == '' || $scope.street == null)
            return;
        /* Search inside the area user is looking at the moment */
        let bounds = map.getBounds();
        let viewbox = bounds.getNorthEast().lng() + ',' + bounds.getNorthEast().lat() + ',' + bounds.getSouthWest().lng() + ',' + bounds.getSouthWest().lat();
        $http.get('https://eu1.locationiq.com/v1/search.php?key=1e7abcc58d0e64&q=' + $scope.street + ' ' + $scope.streetNumber + '&viewbox='+ viewbox + '&bounded=1&format=json&accept-language=el').then((response) => {
            /* If user has selected a periferia check if result address is in that periferia else abort */
            if (($scope.periferia == null || $scope.periferia == '') || (response.data[0].display_name.includes($scope.periferia))) {
                map.setCenter((new google.maps.LatLng(response.data[0].lat, response.data[0].lon)));
                marker.setPosition((new google.maps.LatLng(response.data[0].lat, response.data[0].lon)))
                $scope.lng = parseFloat(response.data[0].lon); $scope.lat = parseFloat(response.data[0].lat);
                map.setZoom(15);
            }
        }).catch((e)=>{
            // do nothing
        })
    }
    $scope.geoLocate = geoLocate;
    $scope.poliSelected = poliSelected;
    /*----------- Modal Tags Section --------------*/
    $scope.tags = [];
    addTag = function () {
        $scope.tags.push({ existingTags: [] });
    }
    deleteTag = function (field) {
        $scope.tags.splice(field.$index, 1);
    }
    loadTags = function (field) {
        $http.get('/getTags?name=' + field.tag.value).then((response) => {
            field.tag.existingTags = response.data;
        })
    }
    fillTextbox = function (selectedTag, input) {
        input.value = selectedTag.name;
        input.existingTags = [];
    }
    $scope.fillTextbox = fillTextbox;
    $scope.loadTags = loadTags;
    $scope.deleteTag = deleteTag;
    $scope.addTag = addTag;
});

