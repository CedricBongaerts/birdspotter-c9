/* global app */

app.controller('homeCtrl', function($scope, auth, $http, $location, store, $rootScope){
  
    /* ----------------------- Variables ----------------------- */
    $scope.auth = auth;
    $scope.showVideo = false;
    
    /* ----------------------- Login Proces ----------------------- */
    $scope.login = function doAuth() {
      auth.signin({
        dict: {
          signin: {
            title: "Login",
          }
        },
        icon: '/img/logo-transparent.png',
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
    
    $scope.openVideo = function() {
      $scope.showVideo = true;
    }
    
    $scope.closeVideo = function() {
      $scope.showVideo = false;
    }
});