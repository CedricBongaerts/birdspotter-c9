/* global app*/
app.controller('navCtrl', ['$scope', 'auth', 'store', '$location', '$state', 'notificationApi', '$rootScope', '$stateParams', '$q', 'birdApi', '$timeout',
              function($scope, auth, store, $location, $state, notificationApi, $rootScope, $stateParams, $q, birdApi, $timeout ){
                
    $scope.isActive = function(destination){
        return destination === $location.path();
    };
    
    $scope.auth = auth;
  
    $scope.getUserId = function() {
      return auth.profile.users;
    };
    
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
    
    $scope.findBirdlist = function() {
      if(this.noResults) {
        console.log('error');
        this.findBird = '';
      } else {
        console.log(this.findBird);
        $state.go('birdlist' , {bird: this.findBird});
        this.findBird = '';
      }
    };
    
    birdApi.getBirds().then(function(res) {
        $scope.birds = res.data;
    });
    
    $rootScope.$on('$stateChangeStart', 
    function(event, toState, toParams, fromState, fromParams){
    if(auth.isAuthenticated) {  
     $q.all({notifications: findNotifications()}).then(function(collections) {
        var notifications = collections.notifications; 
        $scope.notifications = [];
        
        notifications.forEach(function(notification) {
          if(notification.notificationFor === auth.profile.user_id && notification.detected == false) {
              $scope.notifications.push(notification);
          }
        });
        $scope.countNotification = $scope.notifications.length;
        
        $scope.clearNavNotification = function() {
          findNotifications().then(function(res) {
            var currentNotifications = res;
            currentNotifications.forEach(function(notification) {
              var id = notification._id;
                  var dataObj = {detected:true, seen:notification.seen};
                  notificationApi.detectNotification(id, dataObj).then(function(res) {});
              }); 
            });
            
            $scope.countNotification = 0;
          };
        });
      }
     });
    function findNotifications() {
        return notificationApi.findNotifications().then(function(res){
            return res.data;
        });
      }
    
}]);