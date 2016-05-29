/* global app angular*/

app.controller('viewUserCtrl', ['$scope',  '$stateParams', '$http', 'userApi', 'auth', 'captureApi', function($scope, $stateParams, $http, userApi, auth, captureApi) {

    var id = $stateParams.id;
    $scope.auth = auth;

    $scope.captures = [];
    $scope.pageSize = 4;
    $scope.currentPage = 1;
    
    $scope.following = false;
    $scope.follow = false;
    
    userApi.getUsers().then(function(res) {
        var i;
        for (i=0; i<res.data.users.length; i++)
        {
            if (res.data.users[i].user_id == id) {
                // Asynchronous Call
                $scope.user =  res.data.users[i];
                console.log($scope.user);
                
                 $scope.profilePic = function(pic) {
                    if($scope.user.identities[0].provider == "facebook"){
                        pic = $scope.user.picture_large;
                    } else {
                        pic = $scope.user.picture;
                    }
                    return pic;
                };
                
                userApi.findFollow().then(function(res){
                    if($scope.user.user_id==auth.profile.user_id){return}
                    var i;
                    for (i=0; i<res.data.length; i++)
                    {
                        if(res.data[i].followed_id == $scope.user.user_id &&
                           res.data[i].follower_id == auth.profile.user_id) {
                               $scope.following = true;
                               break;
                        } else {if((i+1) == res.data.length){
                            $scope.follow = true;
                            }
                        }
                    }
                });
                
                $scope.unfollowUser = function(){
                    userApi.findFollow().then(function(res){
                        var i;
                        for (i=0; i<res.data.length; i++)
                        {
                            if(res.data[i].followed_id == $scope.user.user_id &&
                                res.data[i].follower_id == auth.profile.user_id) {
                               
                                var follow_id = res.data[i]._id;
                                $http.delete('https://birdspotter-cedricbongaerts.c9users.io/api/follows/'+ follow_id);
                                   $scope.following = false;
                                   $scope.follow = true;
                                   break;
                            } 
                        }
                    });
                };

                
                $scope.followUser = function(){ 
                    var dataObj = {
                            followed_id   : $scope.user.user_id,
                            follower_id   : auth.profile.user_id
                        };
                        
                    userApi.followUser(dataObj)
                    .then(function(res){
                        $scope.following = true;
                        $scope.follow = false;
                        console.log(res.data);
                    });
                };
                
                $scope.connectedWith = function(social) {
                    if($scope.user.identities[0].provider == "facebook"){
                        social = "img/facebook-logo.png";
                    } else {
                        social = "img/google-logo.png";
                    }
                    return social;
                };
                
                captureApi.getAllCaptures()
                .then(function(res) {
                      $scope.captures = res.data.filter(function(captures) {
                        return captures.userId == $scope.user.user_id;
                    });
                });
                
                break;
            } 
        }
    });
}]);