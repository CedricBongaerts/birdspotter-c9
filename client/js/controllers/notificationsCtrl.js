/* global app */

app.controller('notificationsCtrl', [ '$scope', 'auth', 'notificationApi', '$state', '$stateParams', '$timeout', '$window', 'userApi', '$q', '$location',
                    function($scope, auth, notificationApi, $state, $stateParams, $timeout, $window, userApi, $q, $location) {
    
     $scope.notifications = [];
     var unseenNotifications = [];
    
    // notificationApi.findNotifications().then(function(res){
    //   var notifications = res.data;
    //   notifications.forEach(function(notification) {
    //     if(notification.notificationFor === auth.profile.user_id) {
    //             $scope.notifications.push(notification);
    //         } 
    //     });
        
    //     $scope.notifications.forEach(function(notifications) {
    //         if(notifications.seen == false){
    //             newNotifications.push(notifications);
    //         }
            
    //         $scope.countNotification = newNotifications.length;
    //         console.log(newNotifications);
          
    //     });
        
    //     $scope.allSeen = function(){
    //         newNotifications.forEach(function(newNotification) {
    //             var notificationId = newNotification._id;
    //             console.log(notificationId);
    //             var dataObj = {seen:true};
    //             notificationApi.readNotification(notificationId, dataObj)
    //             .then(function(res) {
    //             console.log(res.data.seen);
    //             });
    //         });
    //     };
    // });
    $q.all({notifications: findNotifications(), users: getUsers()}).then(function(collections) {
        var notifications = collections.notifications;
        var users = collections.users;
        
        notifications.filter(function(notification) {
            return notification.notificationFor === auth.profile.user_id;
            }).forEach(function(notification) {
                users.filter(function(user){
                    return notification.notificationFrom === user.user_id;
                }).forEach(function(user) {
                    console.log(user);
                    console.log(notification);
                    var dataObj = {
                        user: user,
                        notification: notification
                    };
                    
                    $scope.notifications.push(dataObj);
                
                });
            });
            console.log($scope.notifications);

            $scope.notifications.forEach(function(notification) {
                if(notification.notification.seen == false){
                    unseenNotifications.push(notification);
                }
            });
            
            $scope.countUnseen = unseenNotifications.length;
            console.log(unseenNotifications);
    
            $scope.seenAll = function() {
                unseenNotifications.forEach(function(unseenNotification) {
                    var notificationId = unseenNotification.notification._id;
                    console.log(notificationId);
                    var dataObj = {seen:true};
                    notificationApi.readNotification(notificationId, dataObj)
                    .then(function(res) {
                    console.log(res.data.seen);
                    });
                });
            };
            
            $scope.seeNotification = function() {
                console.log(this.notification.notification);
                if(this.notification.notification.seen === false) {
                    var dataObj = {seen:true};
                    var notificationId = this.notification.notification._id;
                    console.log(dataObj);
                    console.log(notificationId);
                    notificationApi.readNotification(notificationId, dataObj)
                    .then(function(res) {
                    console.log(res.data.seen);
                    });
                } 
                if(this.notification.notification.concirning == "follow") {
                    $location.path('/user-profile/' + this.notification.notification.parameter);
                } else {
                    $location.path('/detail/' + this.notification.notification.parameter);
                }
            }; 
    });
    
    function findNotifications() {
        return notificationApi.findNotifications().then(function(res){
            return res.data;
        });
    }
    
    function getUsers() {
        return userApi.getUsers().then(function(res) {
            return res.data.users;
        });
    }
    
}]);