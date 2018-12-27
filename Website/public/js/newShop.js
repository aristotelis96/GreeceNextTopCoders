var app = angular.module('Signup', []);

app.controller('signup', function ($scope, $http) {
    
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
            console.log(response.data);
            $scope.poleis = response.data;
            $scope.poleisDis = false;
        });
    }
    $scope.periferiaSelected = periferiaSelected;

    //modal tags
    $scope.tags=[];
    addTag = function(){
        $scope.tags.push({});
    }
    deleteTag = function(field){
        $scope.tags.splice(field.$index,1);
    }
    $scope.deleteTag = deleteTag;
    $scope.addTag = addTag;
});

