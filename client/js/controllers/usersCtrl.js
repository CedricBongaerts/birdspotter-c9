/* global app angular*/

app.controller('usersCtrl', ['$scope',  '$stateParams', '$http', 'userApi', 'auth', 'captureApi', function($scope, $stateParams, $http, userApi, auth, captureApi) {

    userApi.getUsers().then(function(res) {
        $scope.users = res.data.users;
    });
    
    $scope.auth = auth;
}]);