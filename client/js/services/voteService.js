/* global app */

app.factory('voteApi', ['$http', function($http){
    
    var urlBase = 'https://birdspotter-cedricbongaerts.c9users.io/api/votes';
    
    return {
        voteNotification : function(id, data) {
            return $http.post(urlBase + '/' + id + '/notifications', data);
        },
        findLike : function() {
            return $http.get(urlBase);
        },
        
        unlikeCapture : function(id) {
            console.log('clicked');
            console.log(id);
            return $http.delete(urlBase + '/' + id , {ignoreLoadingBar: true});
        }
    };
}]);