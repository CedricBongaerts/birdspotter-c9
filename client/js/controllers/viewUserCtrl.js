/* global app angular*/

app.controller('viewUserCtrl', ['$scope',  '$stateParams', '$http', 'userApi', 'auth', 'captureApi', function($scope, $stateParams, $http, userApi, auth, captureApi) {

    var id = $stateParams.id;
    $scope.auth = auth;
    
    var allUsers = [];

    $scope.captures = [];
    $scope.pageSize = 4;
    $scope.currentPage = 1;
    
    $scope.following = false;
    $scope.follow = false;
    
    userApi.getUsers().then(function(res) {
        var users = res.data.users;
        userApi.findFollow().then(function(res) {
            var follows = res.data;
            
            captureApi.getAllCaptures().then(function(res) {
                var captures = res.data;
            
                var i;
                for(i=0; i<users.length; i++) {
                    allUsers.push(users[i]);
                    if(users[i].user_id == id) {
                        $scope.user = users[i];
                        
                        $scope.profilePic = function(pic) {
                            if($scope.user.identities[0].provider == "facebook"){
                                pic = $scope.user.picture_large;
                            } else {
                                pic = $scope.user.picture;
                            }
                            return pic;
                        };
                        
                        $scope.connectedWith = function(social) {
                            if($scope.user.identities[0].provider == "facebook"){
                                social = "img/facebook-logo.png";
                            } else {
                                social = "img/google-logo.png";
                            }
                            return social;
                        };
                        
                        break;
                    }
                }
                
                var j;
                for (j=0; j<follows.length; j++)
                {
                    if(id==auth.profile.user_id) {
                        break;
                    }
                    if(follows[j].followed_id == id &&
                      follows[j].follower_id == auth.profile.user_id) {
                          $scope.following = true;
                          break;
                    } else {if((j+1) == follows.length){
                        $scope.follow = true;
                        }
                    }
                }
                
                $scope.unfollowUser = function(){
                    var u;
                    for (u=0; u<follows.length; u++)
                    {
                        if(follows[u].followed_id == id &&
                            follows[u].follower_id == auth.profile.user_id) {
                           
                            var follow_id = follows[u]._id;
                            $http.delete('https://birdspotter-cedricbongaerts.c9users.io/api/follows/'+ follow_id);
                              $scope.following = false;
                              $scope.follow = true;
                              $scope.capture.votes.length--;
                              break;
                        } 
                    }
                };
                
                $scope.followUser = function(){ 
                    var dataObj = {
                            followed_id   : id,
                            follower_id   : auth.profile.user_id
                        };
                        
                    userApi.followUser(dataObj)
                    .then(function(res){
                        $scope.following = true;
                        $scope.follow = false;
                    });
                };
                
                $scope.captures = captures.filter(function(captures) {
                    return captures.userId == id;
                });
                
                
                var followingMe = [];
                var meFollowing = [];
                var f;
                for(f=0; f<follows.length; f++) {
                    if(follows[f].followed_id == id) {
                        followingMe.push(follows[f]);
                    }
                    if(follows[f].follower_id == id) {
                        meFollowing.push(follows[f]);
                    }
                }
                $scope.followingMe = followingMe.length;
                $scope.meFollowing = meFollowing.length;
            });
        });
    });
}]);