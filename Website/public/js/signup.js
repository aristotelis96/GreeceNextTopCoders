var app = angular.module('Signup', []);

app.controller('signup', function ($scope, $http) {
    $scope.resetButton = false;

    checkUser = function ($scope) {
        $scope.SubmitButton = false;        
        $scope.messages = [];
        //search if email exists
        if ($scope.email != undefined) {
            $http.get("/check_user?email=" + $scope.email).then(function (response) {
                if (response.data.exists) {
                    let msg = "Το email αυτό υπάρχει ήδη!";
                    //if ($scope.messages.indexOf(msg) == -1) { //make sure the message is not twice in messages array
                    $scope.messages.push(msg);
                   // }
                    $scope.SubmitButton = true;
                    $scope.alertFlag = true; // because http.get is done ASync flag is set BEFORE we have the results
                }
            });
        }
        // if passwords do not match add this message
        if (!angular.equals($scope.password, $scope.confirmation)) {
            $scope.messages.push("Οι κωδικοί δεν ταιρίαζουν!");
            $scope.SubmitButton = true;
        }
        if ($scope.password && $scope.password.length < 8) {
            $scope.messages.push("Ο κωδικός πρέπει να είναι τουλάχιστον 8 χαρακτήρες!");
            $scope.SubmitButton = true;
        }
        
        // if there are no messages to display hide the alert <div>
        if ($scope.messages.length == 0)
            $scope.alertFlag = false;
        else
            $scope.alertFlag = true;

    };
    $scope.checkUser = checkUser;
    checkUser(this);
});

