/* global app */

app.factory('commentApi', ['$http', function($http){
    
    var urlBase = 'https://birdspotter-cedricbongaerts.c9users.io/api/comments';
    
    return {
        findComment : function() {
            return $http.get(urlBase);
        },
        
        deleteComment : function(id) {
            return $http.delete(urlBase + '/' + id);
        }
    };
}]);