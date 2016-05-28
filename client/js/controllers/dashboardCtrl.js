/* global app */

app.controller('dashboardCtrl', ['$scope', '$http', 'captureApi', function($scope, $http, captureApi){
    $scope.captures = [];
    $scope.pageSize = 4;
    $scope.currentPage = 1;
    
    captureApi.getAllCaptures()
        .then(function(res) {
            $scope.captures = res.data.filter(function(captures) {
                return captures;
        });
    });
}]);