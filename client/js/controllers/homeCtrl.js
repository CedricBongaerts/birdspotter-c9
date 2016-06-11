/* global app */

app.controller('homeCtrl', function($scope, auth, $http, $location, store, $rootScope){
    $scope.auth = auth;
    
    $scope.login = function doAuth() {
      auth.signin({
        dict: {
          signin: {
            title: "Register or Login:",
          }
        },
        icon: 'http://science-all.com/images/wallpapers/bird-images/bird-images-1.jpg',
        focusInput: false,
        gravatar: false,
        popup: true,
        authParams: {
          scope: 'openid offline_access',
        }
      }, function(profile, token, accessToken, state, refreshToken) {
        // Success callback
        //Store the status in the scope 
        store.set('profile', profile);
        store.set('token', token);
        store.set('refreshToken', refreshToken);
        $location.path('dashboard');
      }, function(error) {
        console.log("There was an error logging in", error);
      });
    };
});