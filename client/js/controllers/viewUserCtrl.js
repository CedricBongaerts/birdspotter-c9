/* global app*/

app.controller('viewUserCtrl', ['$scope',  '$stateParams', '$http', 'userApi', 'auth', 'captureApi', 'notificationApi', '$q', 'filterFilter', '$state', '$uibModal',
                    function($scope, $stateParams, $http, userApi, auth, captureApi, notificationApi, $q, filterFilter, $state, $uibModal ) {

    /* ----------------------- Variables ----------------------- */
    var id = $stateParams.id;
    $scope.id = $stateParams.id;
    // var auth = auth;
    
    
    $scope.captures = [];
    $scope.meFollowing = [];
    $scope.myFollowers = [];
    $scope.pageSize = 5;
    $scope.currentPage = 1;
    $scope.noCaptures = false;
    $scope.following = false;
    $scope.follow = false;
    $scope.filter = "$";
    $scope.searchBy = "any";
    $scope.search = {$:'', birdname:'', place:''};
    
    /* ----------------------- Process Data ----------------------- */
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
        
    /* ----------------------- Filter options ----------------------- */
        $scope.changeFilterTo = function(pr) {
            $scope.filter = pr;
            if(pr==='$') {
                $scope.searchBy = "any"
            } else {
                $scope.searchBy = pr;
            }
        }
    


        /* ----------------------- Toggle data ----------------------- */
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
            });
            $scope.follow = !$scope.following;
        }
        
        /* ----------------------- Unfollow ----------------------- */
        $scope.unfollowUser = function(){
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
        
        /* ----------------------- Follow ----------------------- */
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
                $scope.myFollowers.length++;
                var followId = res.data._id;
                userApi.followNotification(followId, notificationObj).then(function(res){});
            });
        };
        
        $scope.mapShow = false;
        
        $scope.showFollowers = function() {
            findFollow().then(function(res) {
                var currentFollows = res;
                $scope.follows = [];
                currentFollows.filter(function(myfollow) {
                    console.log(id);
                    console.log(myfollow.followed_id);
                    return myfollow.followed_id === id;
                    }).forEach(function(myfollow) {
                        users.filter(function(user) {
                        return myfollow.follower_id === user.user_id; 
                    }).forEach(function(user) {
                        $scope.follows.push(user);
                    });
                });
                $scope.followShow = true;
            });
        }
        
        $scope.showFollowing = function() {
            findFollow().then(function(res) {
                var currentFollows = res;
                $scope.follows = [];
                currentFollows.filter(function(myfollow) {
                    return myfollow.follower_id === id;
                    }).forEach(function(myfollow) {
                        users.filter(function(user) {
                            
                        return myfollow.followed_id === user.user_id; 
                    }).forEach(function(user) {
                        $scope.follows.push(user);
                    });
                });
                $scope.followShow = true;
            });
        }
        
        $scope.closeFollow = function() {
            $scope.followShow = false;
        };
        
        if($scope.captures.length === 0) {
            $scope.noCaptures = true;
        }
    });
    
    /* ------------------------------- Show Maps ---------------------------------------- */
    $scope.mapShow = false;
    $scope.birdLocation = "Antwerpen";
    
    $scope.showGoogleMap = function() {
        $scope.mapShow = true;
        $scope.birdLocation = this.capture.place;
    };
    
    $scope.closeMap = function() {
        $scope.mapShow = false;
    };
    
    /* ------------------------------- Show Preview ------------------------------------ */
    $scope.imgPreviewShow = false;
    
    $scope.showImgPreview = function() {
        $scope.imgPreviewShow = true;
        $scope.thisCapture = this.capture;
    }
    
    $scope.closeImgPreview = function() {
        console.log('did');
        $scope.imgPreviewShow = false;
    }
 
/* ----------------------- Retrieve Services - Data ----------------------- */                
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

