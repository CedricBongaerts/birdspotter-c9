/* global app */

app.controller('dashboardCtrl', ['$scope', '$http', 'captureApi', 'userApi', function($scope, $http, captureApi, userApi){
    $scope.captures = [];
    $scope.pageSize = 4;
    $scope.currentPage = 1;
    
    captureApi.getAllCaptures().then(function(res) {
        $scope.captures = res.data;
    });
}]);