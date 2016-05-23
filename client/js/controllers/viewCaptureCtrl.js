/* global app */

app.controller('viewCaptureCtrl', ['$scope',  '$stateParams', '$http', 'captureApi', function($scope, $stateParams, $http, captureApi) {

     var id = $stateParams.id;
     
     $scope.currentCapture = captureApi.findCapture(id);
     console.log($scope.currentCapture);

}]);