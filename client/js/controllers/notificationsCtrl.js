/* global app */

app.controller('notificationsCtrl', [ '$scope', 'auth', 'notificationApi', '$state', '$stateParams', '$timeout', '$window',
                    function($scope, auth, notificationApi, $state, $stateParams, $timeout, $window) {
    
    $scope.notifications = [];
    var newNotifications = [];
    
    notificationApi.findNotifications().then(function(res){
      var notifications = res.data;
      notifications.forEach(function(notification) {
        if(notification.notificationFor === auth.profile.user_id) {
                $scope.notifications.push(notification);
            } 
        });
        
        console.log($scope.notifications);
        $scope.notifications.forEach(function(notifications) {
            if(notifications.seen == false){
                newNotifications.push(notifications);
            }
            
            $scope.countNotification = newNotifications.length;
          
            $scope.allSeen = function(){
                newNotifications.forEach(function(notification) {
                    var notificationId = notification._id;
                    var dataObj = {seen: true,};
                    
                    notificationApi.readNotification(notificationId, dataObj)
                    .then(function(res) {
                        
                    console.log(res.data);
                    });
                });
                console.log(newNotifications);
                // $window.location.reload();
            };
        });
    });
}]);