function endfunc() {
    var checkBox = document.getElementById("endcheck");
    var text = document.getElementById("displayend");
    if (checkBox.checked == true) {
        text.style.display = "block";
    } else {
        text.style.display = "none";
    }
}
function startfunc() {
    var checkBox = document.getElementById("startcheck");
    var text = document.getElementById("displaystart");
    if (checkBox.checked == true) {
        text.style.display = "block";
    } else {
        text.style.display = "none";
    }
}
var app = angular.module('addProduct', []);

app.controller('addProduct', function ($scope, $http) {
    //modal tags
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
    /* Search Products */

    /* Search shop */
    $scope.shopNotFound = false;
    $scope.companyInfoShow = false; //shop info is displayed after shop is selected
    $scope.companies = [];    
    $scope.checkCompany = () => {
        $scope.SubmitButton = true;
        let newComp = [];
        $scope.companyInfoShow = false;
        if ($scope.companyInput != undefined) {
            $http.get('/searchShop?name=' + $scope.companyInput).then((response) => {            
                response.data.slice(0,10).forEach(element => {
                  //  $scope.companies.push(element.name);
                  newComp.push(element);
                })
                $scope.companies = newComp;
                if(response.data.length == 0){
                    $scope.shopNotFound = true;
                }
                else{
                    $scope.shopNotFound = false;
                }
            })
        }
    }
    $scope.fillCompany = (company) => {        
        $scope.companyInput = company.name;
        $scope.companies = [];
        $scope.companyInfo = company;
        $scope.companyInfoShow = true;
        $scope.SubmitButton = false;
    }

});