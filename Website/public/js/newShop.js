var app = angular.module('Signup', []);

app.controller('signup', function ($scope, $http) {
    
    /*---------------- Map and Addresses Section -----------*/
    var map;
    var marker;
    //load periferies and poleis
    $http.get('/addresses/periferies')
        .then( (response) => {
            $scope.periferies = response.data;
    });

    $scope.poleisDis = true;
    //periferia and poleis functions
    periferiaSelected = function () {
        let periferia = $scope.periferia;
        $http.get('/addresses/poleis?periferia=' + periferia)
        .then( (response) => {
            $scope.poleis = response.data;
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
    geoLocate = function (){
        if($scope.streetNumber == '' || $scope.streetNumber == null || $scope.street == '' || $scope.street == null)
            return;
        $http.get('https://eu1.locationiq.com/v1/search.php?key=1e7abcc58d0e64&q=' + $scope.street + ' ' + $scope.streetNumber + '&format=json&accept-language=el').then((response) => {
            /* If user has selected a periferia check if result address is in that periferia else abort */
            if (($scope.periferia == null || $scope.periferia == '') || response.data[0].display_name.includes($scope.periferia)) {
                map.setCenter((new google.maps.LatLng(response.data[0].lat, response.data[0].lon)));
                marker.setPosition((new google.maps.LatLng(response.data[0].lat, response.data[0].lon)))
                $scope.lng = parseFloat(response.data[0].lon); $scope.lat = parseFloat(response.data[0].lat);
                map.setZoom(15);
                }            
        })
    }
    $scope.geoLocate = geoLocate;
    $scope.poliSelected = poliSelected;
    /*Declare and create Map */
    function myMap() {
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
            $http.get(' https://eu1.locationiq.com/v1/reverse.php?key=1e7abcc58d0e64&lat='+ $scope.lat +'&lon='+ $scope.lng + '&format=json&accept-language=el').then((response)=>{
                let address = response.data.address;
                try{
                    $scope.periferia = address.state_district.replace('Περιφέρεια ', ''); /* Geo location returns 'Περιφερεια .. ' , we need to remove that */
                } catch(e){
                    // do nothing. try/catch needed in case of undefined/null etc.
                }
                periferiaSelected();
                /* address contains fields city/town/village one at a time, rest are null*/
                let name = '';
                if (address.city != undefined) name += address.city;
                if (address.town != undefined) name += address.town;
                if (address.village != undefined) name += address.village;
                $scope.poli = name;
                $scope.street = '';
                if (address.road != undefined) $scope.street += address.road;
                $scope.streetNumber = parseInt(address.house_number);
            })
        });

    }
    myMap(); // Initialize Map

    /*----------- Modal Tags Section --------------*/
    $scope.tags=[];
    addTag = function(){
        $scope.tags.push({existingTags: []});
    }
    deleteTag = function(field){
        $scope.tags.splice(field.$index,1);
    }
    loadTags = function(field){
        $http.get('/getTags?name='+field.tag.value).then((response)=>{
            field.tag.existingTags = response.data;
        })
    }
    fillTextbox = function(selectedTag, input){
        input.value = selectedTag.name;
        input.existingTags = [];
    }
    $scope.fillTextbox = fillTextbox;
    $scope.loadTags = loadTags;
    $scope.deleteTag = deleteTag;
    $scope.addTag = addTag;    
});

