/* global app */

app.controller('usersCtrl', ['$scope',  '$stateParams', '$http', 'userApi', 'auth', 'captureApi', 
                function($scope, $stateParams, $http, userApi, auth, captureApi) {
    
    /* ----------------------- Variables ----------------------- */
    $scope.auth = auth;
    $scope.users = [];
    $scope.pageSize = 25;
    $scope.currentPage = 1;
    $scope.reverse = true;
    
    /* ----------------------- Retrieve Users ----------------------- */
    userApi.getUsers().then(function(res) {
        $scope.users = res.data.users;
    
        console.log($scope.users);
        $scope.users.filter(function(users) {
            return users;
        });
    });
    
    /* ----------------------- Process Data ----------------------- */
    $scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    };
}]);