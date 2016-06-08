/* global app */

app.factory('notificationApi', ['$http', function($http){
    
    var urlBase = 'https://birdspotter-cedricbongaerts.c9users.io/api/notifications';
    
    return {
        detectNotification : function(id, data) {
            return $http.post(urlBase + '/' + id, data);
        },
        readNotification : function(id, data) {
            return $http.post(urlBase + '/' + id, data);
        },
        
        findNotifications : function() {
            return $http.get(urlBase);
        }
    };
}]);
