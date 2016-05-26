/* global app angular*/

app.controller('viewProfileCtrl', ['$scope',  '$stateParams', '$http', 'userApi', 'auth', 'captureApi', function($scope, $stateParams, $http, userApi, auth, captureApi) {

    var id = $stateParams.id;
    
    userApi.getUsers().then(function(res) {
        var i;
        for (i=0; i<res.data.users.length; i++)
        {
            console.log(res.data.users[i]);
            if (res.data.users[i].user_id === id) {
                $scope.user =  res.data.users[i];
                
                $scope.profilePic = function(pic) {
                    if($scope.user.identities[0].provider === "facebook"){
                        pic = "https://graph.facebook.com/" + $scope.user.identities[0].user_id + "/picture?width=9999";
                    } else {
                        pic = $scope.user.picture;
                    }
                    return pic;
                };
                
                $scope.connectedWith = function(social) {
                    if($scope.user.identities[0].provider === "facebook"){
                        social = "img/facebook-logo.png";
                    } else {
                        social = "img/google-logo.png";
                    }
                    return social;
                };
                
                captureApi.getAllCaptures()
                .then(function(res) {
                      $scope.captures = res.data.filter(function(captures) {
                        return captures.userId === $scope.user.user_id
                    });
                });
                break;
            } 
        }
    });
    
    $scope.auth = auth;
     
    $scope.captures = [];
    $scope.pageSize = 4;
    $scope.currentPage = 1;
}]);