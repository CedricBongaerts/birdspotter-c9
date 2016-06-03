/* global app */

app.controller('usersCtrl', ['$scope',  '$stateParams', '$http', 'userApi', 'auth', 'captureApi', function($scope, $stateParams, $http, userApi, auth, captureApi) {
    $scope.auth = auth;
    $scope.users = [];
    $scope.pageSize = 25;
    $scope.currentPage = 1;
    
    userApi.getUsers().then(function(res) {
        $scope.users = res.data.users;
        console.log($scope.users.length);
        $scope.users.filter(function(users) {
            return users;
        });
    });
    
    $scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    };
}]);