/* global app angular*/

app.controller('usersCtrl', ['$scope',  '$stateParams', '$http', 'userApi', 'auth', 'captureApi', function($scope, $stateParams, $http, userApi, auth, captureApi) {
    $scope.auth = auth;
    
    userApi.getUsers().then(function(res) {
        $scope.users = res.data.users;
    });
}]);