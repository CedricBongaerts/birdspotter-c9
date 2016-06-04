/* global app */

app.controller('followingCtrl', ['$scope', '$http', 'userApi', 'auth', 'captureApi', 'angularGridInstance', function($scope, $http, userApi, auth, captureApi, angularGridInstance) {

    $scope.auth = auth;

    $scope.captures = [];
    $scope.following = [];
    var i,j, f;
    
    userApi.findFollow().then(function(res) {
        var follows = res.data;
        
        userApi.getUsers().then(function(res) {
            var users = res.data.users;
        
            captureApi.getAllCaptures().then(function(res) {
                var captures = res.data;
                
                for(i=0; i<follows.length; i++) {
                    if(follows[i].follower_id == auth.profile.user_id) {
                        for(j=0; j<captures.length; j++){
                            if(follows[i].followed_id == captures[j].userId) {
                                 $scope.captures.push(captures[j]);
                            }
                        }
                        
                        for(f=0; f<users.length; f++){
                            if(follows[i].followed_id == users[f].user_id) {
                                 $scope.following.push(users[f]);
                            }
                        }
                    }
                }
                
            });
        });
    });
    $scope.refresh = function(){
            angularGridInstance.gallery.refresh();
    }
}]);