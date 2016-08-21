/* global app angular*/

app.controller('birdcapturesCtrl', ['$scope',  '$stateParams', '$http', 'userApi', 'auth', 'captureApi', 'birdApi', '$filter', '$q',
                function($scope, $stateParams, $http, userApi, auth, captureApi, birdApi, $filter, $q) {

        $scope.numberToDisplay = 2;
        $scope.unknownFilter = "$";

    /* ----------------------- Process Data ----------------------- */
    $q.all({ birds: getBirds(), captures: getAllCaptures() }).then(function(collections) {
        $scope.birds = collections.birds;
        $scope.captures = collections.captures.reverse();
        
        $scope.loadMore = function() {
                if ($scope.numberToDisplay + 1 < $scope.captures.length) {
                    $scope.numberToDisplay += 1;
                } else {
                    $scope.numberToDisplay = $scope.captures.length;
                }
        };
        
        $scope.getInfo = function(capture) {
            console.log(capture);
        };
    });
    
    /* ---------------------- Filter Options ---------------------*/
    $scope.toggleUnknown = function() {
        if($scope.checked) {
            console.log('true');
            $scope.searchUnknown = 'Unknown';
        } else {
            $scope.searchUnknown = '';
            console.log('false');
        }
        console.log($scope.searchUnknown);
        return $scope.searchUnknown;
        
    };
    
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