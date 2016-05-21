/* global app */

app.controller('captureCtrl',[ '$scope', 'Api', function($scope, Api){
    $scope.form = {};

    $scope.addToDatabase = function() {
        console.log('button clicked');
        Api.Capture.save({}, $scope.form, function(){
            $scope.form = {};
        })
    }
}]);