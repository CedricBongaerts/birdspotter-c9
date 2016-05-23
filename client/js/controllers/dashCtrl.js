/* global app */

app.controller('dashCtrl', ['$scope', '$http', 'captureApi', function($scope, $http, captureApi){
    $scope.captures = [];
    console.log($scope.captures);
    $scope.pageSize = 4;
    $scope.currentPage = 1;
    
    captureApi.getAllCaptures()
        .then(function(res) {
            $scope.captures = res.data.filter(function(captures) {
                return captures
        }, function(err) {
            //do something
        });
    });
}]);