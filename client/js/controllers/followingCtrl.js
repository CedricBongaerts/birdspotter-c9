/* global app */

app.controller('followingCtrl', ['$scope', '$http', 'userApi', 'auth', 'captureApi', 'angularGridInstance', '$q', function($scope, $http, userApi, auth, captureApi, angularGridInstance, $q) {
        
    $scope.auth = auth;

    $scope.users = [];
    $scope.captures = [];
    $scope.following = [];
    
    $q.all({follows: findFollow(), users: getUsers(), captures: getAllCaptures()}).then(function(collections) {
    var follows = collections.follows;
    var users = collections.users;
    var captures = collections.captures;
        follows.filter(function(follow) {
            return follow.follower_id === auth.profile.user_id;
            }).forEach(function(follow) {
                
            users.filter(function(user) {
                return user.user_id === follow.followed_id;
                }).forEach(function(user) {
                    $scope.following.push(user);
            });
        });
        
        follows.filter(function(follow) {
            return follow.follower_id === auth.profile.user_id;
            }).forEach(function(follow) {
            
            captures.filter(function(capture){
                console.log(follow.followed_id === capture.userId);
                return follow.followed_id === capture.userId;
            }).forEach(function(capture){
                users.filter(function(user){
                    return capture.userId === user.user_id;
                }).forEach(function(user){
                    $scope.captures = captures.map(function(capture){
                        return {
                            user: user,
                            capture: capture
                        };
                    });
                });
            });
        });
    });
    
    function findFollow() {
        return userApi.findFollow().then(function(res) {
            return res.data;
        });
    }
    
    function getUsers() {
        return userApi.getUsers().then(function(res) {
            return res.data.users;
        });
    }
    
    function getAllCaptures() {
        return captureApi.getAllCaptures().then(function(res) {
            return res.data;
        });
    }
    
    $scope.refresh = function(){
            angularGridInstance.gallery.refresh();
    };
}]);

    
    // userApi.findFollow().then(function(res) {
    //     var follows = res.data;
        
    //     userApi.getUsers().then(function(res) {
    //         var users = res.data.users;
        
    //         captureApi.getAllCaptures().then(function(res) {
    //             var captures = res.data;
                
    //             for(i=0; i<follows.length; i++) {
    //                 if(follows[i].follower_id == auth.profile.user_id) {
    //                     for(f=0; f<users.length; f++){
    //                         if(follows[i].followed_id == users[f].user_id) {
    //                              $scope.following.push(users[f]);
    //                         }
    //                     }
                        
    //                     for(j=0; j<captures.length; j++){
    //                         if(follows[i].followed_id == captures[j].userId) {
    //                             for(u=0; u<users.length; u++){
    //                                 if(captures[j].userId == users[u].user_id) {
                                        
    //                                     var captureObj = {
    //                                         user : users[u],
    //                                         capture: captures[j]
    //                                     };
    //                                     console.log(captureObj);
    //                                      $scope.captures.push(captureObj);
    //                                 }
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //             console.log($scope.following);
    //         });
    //     });
    // })