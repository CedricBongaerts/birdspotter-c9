/* global app */

app.factory('birdsuggestionApi', ['$http', function($http){
    
    var urlBase = 'https://birdspotter-cedricbongaerts.c9users.io/api/birdsuggestions';
    var voteUrlBase = 'https://birdspotter-cedricbongaerts.c9users.io/api/votesBirdsuggestion';
    
    return {
        suggestionNotification : function(id, data) {
            return $http.post(urlBase + '/' + id + '/notifications', data);
        },
        findAllSuggestions : function() {
            return $http.get(urlBase);
        },
        
        deleteSuggestion : function(id) {
            return $http.delete(urlBase + '/' + id, {ignoreLoadingBar: true});
        },
        
        voteSuggestion : function(id, data) {
            return $http.post(urlBase + '/' + id + '/votesbirdsuggestion', data);
        },
        
        findVoteSuggestions : function() {
            return $http.get(voteUrlBase);
        }
    };
}]);