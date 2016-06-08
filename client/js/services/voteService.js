/* global app */

app.factory('voteApi', ['$http', function($http){
    
    var urlBase = 'https://birdspotter-cedricbongaerts.c9users.io/api/votes';
    
    return {
        findLike : function() {
            return $http.get(urlBase);
        },
        
        unlikeCapture : function(id) {
            return $http.delete(urlBase + '/' + id , {ignoreLoadingBar: true});
        }
    };
}]);