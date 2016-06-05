/* global app */

app.factory('captureApi', ['$http', '$location', function($http, $location){
    
    var urlBase = 'https://birdspotter-cedricbongaerts.c9users.io/api/captures';
    
    return {
        getAllCaptures : function () {
            return $http.get(urlBase);
        },
        
        insertCapture : function(data) {
            return $http.post(urlBase, data);
        },
        
        findCapture : function(id) {
            return $http.get(urlBase + '/' + id)
            .error(function(data,status,headers,config) {
                $location.url('/error');
            });
        },
        
        editCapture : function(id, data) {
            return $http.post(urlBase + '/' + id, data);
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