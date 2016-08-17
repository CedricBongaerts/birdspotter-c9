/* global app angular*/

app.controller('birdcapturesCtrl', ['$scope',  '$stateParams', '$http', 'userApi', 'auth', 'captureApi', 'birdApi', '$filter', '$q',
                function($scope, $stateParams, $http, userApi, auth, captureApi, birdApi, $filter, $q) {
                
    
    /* ----------------------- Process Data ----------------------- */
    $q.all({ birds: getBirds(), captures: getAllCaptures() }).then(function(collections) {
        $scope.birds = collections.birds;
        $scope.captures = collections.captures;
        
    });
    
    /* ----------------------- Retrieve Services - Data ----------------------- */
    function getBirds() {
        return birdApi.getBirds().then(function(res) {
            return res.data;
        });
    }
    
    function getAllCaptures() {
        return captureApi.getAllCaptures().then(function(res) {
            return res.data;
        });
    }
}]);