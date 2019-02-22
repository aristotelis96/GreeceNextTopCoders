var app = angular.module('Output', ['ngAnimate']);

app.controller('output', function ($scope) {    
    $scope.hideProductPrice = [];
    $scope.hideProductDate = [];
    
    /* if lg screen show filters else dont */
    if(window.innerWidth < 1200)
        $scope.filtersHide = true;
    else
        $scope.filtersHide = false;
    /* Show/Hide filters */
    $scope.openFilters = function () {
        $scope.filtersHide = !$scope.filtersHide;
    }

    $scope.priceRange = function (){
        let min = $scope.minPrice;
        let max = $scope.maxPrice;
        
        for(let i=0; i<products.length; i++){
            let minFlag, maxFlag;
            if(min == undefined || min == '' || products[i].price >= min)
                minFlag = false;
            else
                minFlag = true;
            if(max == undefined || max == '' || products[i].price <= max)
                maxFlag = false;
            else
                maxFlag = true;
            $scope.hideProductPrice[i] = minFlag || maxFlag;
        }
    }

    $scope.dateChange = function () {
        let startDate = $scope.startdate;
        let endDate = $scope.enddate;
        for(let i=0; i<products.length; i++){
            let minFlag, maxFlag;

            let s_prod_date = new Date(products[i].dateFrom);
            let e_prod_date = new Date(products[i].dateTo);
            if (products[i].dateFrom != "0000-00-00") {
                if (startDate == undefined || startDate == '' || s_prod_date >= startDate)
                    minFlag = false;
                else
                    minFlag = true;
            }
            if (products[i].dateTo != "0000-00-00") {
                if (endDate == undefined || endDate == '' || e_prod_date <= endDate)
                    maxFlag = false;
                else
                    maxFlag = true;
            }
            $scope.hideProductDate[i] = minFlag || maxFlag;
        }
    }

});

