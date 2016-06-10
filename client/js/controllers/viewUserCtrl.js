/* global app*/

app.controller('viewUserCtrl', ['$scope',  '$stateParams', '$http', 'userApi', 'auth', 'captureApi', 'notificationApi', '$q', 'filterFilter',
                    function($scope, $stateParams, $http, userApi, auth, captureApi, notificationApi, $q, filterFilter) {

    var id = $stateParams.id;
    // var auth = auth;
    
    $scope.captures = [];
    $scope.pageSize = 4;
    $scope.currentPage = 1;
    
    $scope.following = false;
    $scope.follow = false;
    
    $q.all({follows: findFollow(), captures: getAllCaptures(), user: getUser(id)}).then(function(collections) {
        var user = collections.user;
        $scope.user = user;
        var follows = collections.follows;
        var captures = collections.captures;
        
        $scope.meFollowing = [];
        $scope.myFollowers = [];
        
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
        console.log(captures);
        console.log($scope.captures.length);
        
        $scope.profilePic = function(pic) {
            if(user.identities[0].provider == "facebook"){
                pic = user.picture_large;
            } else {
                pic = user.picture;
            }
            return pic;
        }; 
        console.log($scope.user);
       
        $scope.connectedWith = function(social) {
            if($scope.user.identities[0].provider == "facebook"){
                social = "fa-facebook-official";
            } else {
                social = "fa-google-plus-square";
            }
            return social;
        };
        
        if(id === auth.profile.user_id){return;}
        follows.forEach(function(follow) {
            if(follow.followed_id == id &&
                  follow.follower_id == auth.profile.user_id) {
                $scope.following = true;
                return;
            }
        });
        $scope.follow = !$scope.following;
        console.log($scope.follow);
        console.log($scope.following);
        
        
        $scope.unfollowUser = function(){
            console.log('done');
            follows.forEach(function(follow) {
                if(follow.followed_id == id && follow.follower_id == auth.profile.user_id) {
                    var follow_id = follow._id;
                    userApi.unfollowUser(follow_id).then(function(res) {
                        $scope.following = false;
                              $scope.follow = true;
                              $scope.myFollowers.length--;
                              return;
                    });
                }
            });
        };
        
        $scope.followUser = function(){ 
            console.log('ok');
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
            console.log(notificationObj);
                
            userApi.followUser(followObj)
            .then(function(res){
                $scope.following = true;
                $scope.follow = false;
                $scope.myFollowers.length++;
                console.log(notificationObj);
                var followId = res.data._id;
                userApi.followNotification(followId, notificationObj).then(function(res){});
            });
        };
        
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

}]);

