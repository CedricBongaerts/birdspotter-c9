/* global app*/
app.controller('navCtrl', ['$scope', 'auth', 'store', '$location', '$state', 'notificationApi',
              function($scope, auth, store, $location, $state, notificationApi){
    
    $scope.isActive = function(destination){
        return destination === $location.path();
    };
    
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
    
    $scope.logout = function() {
        auth.signout();
        store.remove('token');
        store.remove('profile');
        store.remove('refreshToken');
        auth.isAuthenticated = false;
        $location.path('/');
    };
    
    $scope.notifications = [];
    
    notificationApi.findNotifications().then(function(res){
      var notifications = res.data;
      notifications.forEach(function(notification) {
        if(notification.notificationFor === auth.profile.user_id && notification.detected == false) {
                    $scope.notifications.push(notification);
          } 
      });
      $scope.countNotification = $scope.notifications.length;

        $scope.clearNavNotification = function() {
        $scope.notifications.forEach(function(notification) {
            var id = notification._id;
            notificationApi.detectNotification(id).then(function(res) {});
        });
        $scope.countNotification = 0;
    };
    });
}]);