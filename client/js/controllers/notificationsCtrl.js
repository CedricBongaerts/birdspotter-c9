/* global app */

app.controller('notificationsCtrl', [ '$scope', 'auth', 'notificationApi', '$state', '$stateParams', '$timeout', '$window', 'userApi', '$q', '$location',
                    function($scope, auth, notificationApi, $state, $stateParams, $timeout, $window, userApi, $q, $location) {
    
    /* ----------------------- Variables ----------------------- */
    $scope.notifications = [];
    var unseenNotifications = [];
    
    /* ----------------------- Process Data ----------------------- */
    $q.all({notifications: findNotifications(), users: getUsers()}).then(function(collections) {
        var notifications = collections.notifications.reverse();
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
            
            $scope.notificationData = $scope.notifications.slice(0, 5);
            $scope.getMoreData = function () {
                console.log($scope.notificationData);
                $scope.notificationData = $scope.notifications.slice(0, $scope.notificationData.length + 5);
            }

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
                    });
                });
                $state.go($state.current, {}, {reload: true});
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
    
    /* ----------------------- Retrieve Services - Data ----------------------- */
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