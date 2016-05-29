/* global app angular*/

app.controller('followingCtrl', ['$scope', '$http', 'userApi', 'auth', 'captureApi', function($scope, $http, userApi, auth, captureApi) {

    $scope.auth = auth;

    $scope.captures = [];
    var i,j;
    
    userApi.findFollow().then(function(res) {
        var follows = res.data;

        captureApi.getAllCaptures().then(function(res) {
            var captures = res.data;
            for(i=0; i<follows.length; i++) {
                if(follows[i].follower_id == auth.profile.user_id) {
                    for(j=0; j<captures.length; j++){
                        if(follows[i].followed_id == captures[j].userId) {
                             $scope.captures.push(captures[j]);
                        }
                    }
                }
            }
        });
    });
}]);