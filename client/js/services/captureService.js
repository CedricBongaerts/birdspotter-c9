/* global app */

app.factory('captureApi', ['$http', function($http){
    
    var urlBase = 'https://birdspotter-cedricbongaerts.c9users.io/api/captures';
    
    return {
        getAllCaptures : function () {
            return $http.get(urlBase);
        },
        
        insertCapture : function(data) {
            return $http.post(urlBase, data);
        },
        
        findCapture : function(id) {
            return $http.get(urlBase + '/' + id);
        },
        
        deleteCapture : function(id) {
            return $http.delete(urlBase + '/' + id);
        },
        
        postComment : function(id, data) {
            return $http.post(urlBase + '/' + id + '/comments', data);
        },
        
        likeCapture : function(id, data) {
            return $http.post(urlBase + '/' + id + '/votes', data);
        },
        
    };
}]);