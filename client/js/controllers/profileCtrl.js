/* global app */

app.controller('profileCtrl', ['$scope', 'auth', '$http', 'captureApi', function($scope, auth, $http, captureApi) {
    
    $scope.auth = auth;
    $scope.date = auth.profile.created_at;
    $scope.captures = [];
    $scope.pageSize = 4;
    $scope.currentPage = 1;
    
    
    $scope.profilePic = function(pic) {
        if(auth.profile.identities[0].provider === "facebook"){
            pic = "https://graph.facebook.com/" + auth.profile.identities[0].user_id + "/picture?width=9999";
        } else {
            pic = auth.profile.picture;
        }
        return pic;
    }
    
    $scope.connectedWith = function(social) {
        if(auth.profile.identities[0].provider === "facebook"){
            social = "img/facebook-logo.png";
        } else {
            social = "img/google-logo.png";
        }
        return social;
    }
    
   captureApi.getAllCaptures()
        .then(function(res) {
              $scope.captures = res.data.filter(function(captures) {
                return captures.userId === $scope.auth.profile.user_id
            });
        });
}]);