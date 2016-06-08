/* global app */

app.factory('commentApi', ['$http', function($http){
    
    var urlBase = 'https://birdspotter-cedricbongaerts.c9users.io/api/comments';
    
    return {
        commentNotification : function(id, data) {
            return $http.post(urlBase + '/' + id + '/notifications', data);
        },
        findComment : function() {
            return $http.get(urlBase);
        },
        
        deleteComment : function(id) {
            return $http.delete(urlBase + '/' + id, {ignoreLoadingBar: true});
        }
    };
}]);