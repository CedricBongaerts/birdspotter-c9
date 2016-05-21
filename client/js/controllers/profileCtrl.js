/* global app */

app.controller('profileCtrl', function($scope, auth, $http) {
    
    $scope.auth = auth;
    $scope.date = auth.profile.created_at;
    
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
    
    $http.get('https://birdspotter-cedricbongaerts.c9users.io/api/captures')
        .then(function(result) {
            $scope.captures = result.data;
            console.log($scope.captures);
    });
    
    
});