/* global app*/

app.controller('viewUserCtrl', ['$scope',  '$stateParams', '$http', 'userApi', 'auth', 'captureApi', 'notificationApi', '$q', 'filterFilter', '$state',
                    function($scope, $stateParams, $http, userApi, auth, captureApi, notificationApi, $q, filterFilter, $state) {

    var id = $stateParams.id;
    // var auth = auth;
    
    $scope.captures = [];
    $scope.followers = [];
    $scope.meFollowing = [];
    $scope.myFollowers = [];
    $scope.pageSize = 5;
    $scope.currentPage = 1;
    
    $scope.following = false;
    $scope.follow = false;
    
    $q.all({follows: findFollow(), captures: getAllCaptures(), user: getUser(id), users: getUsers()}).then(function(collections) {
        var user = collections.user;
        $scope.user = user;
        var users = collections.users;
        var follows = collections.follows;
        var captures = collections.captures;
        
        follows.forEach(function(follow) {
            if(follow.followed_id === id) {
                $scope.myFollowers.push(follow);
            }
            if(follow.follower_id === id) {
                $scope.meFollowing.push(follow);
            }
        });
        
        captures.filter(function(capture) {
            return capture.userId === id;
        }).forEach(function(capture) {
            $scope.captures.push(capture);
        });

        $scope.profilePic = function(pic) {
            if(user.identities[0].provider == "facebook"){
                pic = user.picture_large;
            } else {
                pic = user.picture;
            }
            return pic;
        }; 
       
        $scope.connectedWith = function(social) {
            if($scope.user.identities[0].provider == "facebook"){
                social = "fa-facebook-official";
            } else {
                social = "fa-google-plus-square";
            }
            return social;
        };
        
        if(id === auth.profile.user_id) {
            // do nothing -> Both following buttons are invisiable.
        } else {
            follows.forEach(function(follow) {
                if(follow.followed_id == id &&
                      follow.follower_id == auth.profile.user_id) {
                    $scope.following = true;
                }
                console.log('do');
            });
            $scope.follow = !$scope.following;
        }
        
        $scope.unfollowUser = function(){
            follows.forEach(function(follow) {
                if(follow.followed_id == id && follow.follower_id == auth.profile.user_id) {
                    var follow_id = follow._id;
                    userApi.unfollowUser(follow_id).then(function(res) {
                        $scope.following = false;
                        $scope.follow = true;
                        return;
                    });
                }
            });
            
        };
        
        $scope.followUser = function(){ 
            var followObj = {
                    followed_id   : id,
                    follower_id   : auth.profile.user_id
                };
            
            var notificationObj = {
                    notificationFor     : id,
                    notificationFrom    : auth.profile.user_id,
                    concirning          : 'follow',
                    parameter           : auth.profile.user_id
            };
                
            userApi.followUser(followObj)
            .then(function(res){
                $scope.following = true;
                $scope.follow = false;
                var followId = res.data._id;
                userApi.followNotification(followId, notificationObj).then(function(res){});
            });
        };
        
        follows.filter(function(myfollow) {
            return myfollow.followed_id === id;
            }).forEach(function(myfollow) {
                users.filter(function(user) {
                return myfollow.follower_id === user.user_id; 
            }).forEach(function(user) {
                $scope.followers.push(user);
            });
        });
    });
                
function getUser(id) {
    return userApi.getUser(id).then(function(res) {
        return res.data;
    });
}

function findFollow() {
    return userApi.findFollow().then(function(res) {
        return res.data;
    });
}

function getAllCaptures() {
    return captureApi.getAllCaptures().then(function(res) {
        return res.data;
    });
}

function getUsers() {
    return userApi.getUsers().then(function(res) {
        return res.data.users;
    });
}

}]);

