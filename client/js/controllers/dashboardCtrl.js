/* global app */
app.controller('dashboardCtrl', ['$scope', '$http', 'captureApi', 'userApi', 'filterFilter', '$q', 'auth', 'NgMap',
                        function ($scope, $http, captureApi, userApi, filterFilter, $q, auth, NgMap) {
                    
    /* ----------------------- Variables ----------------------- */
    
    $scope.captures = [];
    $scope.pageSize = 10;
    $scope.currentPage = 1;
    $scope.topPosters = [];
    $scope.auth = auth;
    $scope.mapShow = false;
    $scope.birdLocation = "Antwerpen";
    
    /* ----------------------- Map Operations ----------------------- */
    
    $scope.showGoogleMap = function() {
        $scope.mapShow = true;
        $scope.birdLocation = this.capture.place;
        console.log($scope.birdLocation);
    };
    
    $scope.closeMap = function() {
        $scope.mapShow = false;
        console.log('did something');
    };
    
     /* ----------------------- Count Captures ----------------------- */
    
    $scope.getCount = function getCount(strCat) {
        return filterFilter($scope.captures, {userId: strCat}).length;
    };
    
    /* ----------------------- Process Data ----------------------- */
    
    $q.all({captures: getAllCaptures(), users: getUsers()}).then(function(collections) {
        $scope.captures = collections.captures;
        return collections.users;
    }).then(function (users) {
        $scope.topPosters = users.map(function(user) {
            //I think your user has propery "id" or similar
            return {
                user: user,
                amountPosted: $scope.getCount(user.user_id)
            };
        });
    });
    
    /* ----------------------- Retrieve Services - Data ----------------------- */    
    function getAllCaptures() {
        return captureApi.getAllCaptures().then(function (res) {
            return res.data;
        });
    }
    
    function getUsers() {
        return userApi.getUsers().then(function (res) {
            return res.data.users;
        });
    }

}]);