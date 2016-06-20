/* global app */

app.factory('birdApi', ['$http', function($http){
    
    var urlBirds = 'https://api.myjson.com/bins/2ncjk';
    
    return {
        getBirds : function() {
            return $http.get(urlBirds);
        },
        
        getDuckEngine : function(data) {
            return $http.jsonp('https://api.duckduckgo.com/?q=' + data + '&format=json&callback=JSON_CALLBACK&pretty=1');
        },
        
        getWikipedia: function(data) {
            return $http.jsonp('https://en.wikipedia.org/w/api.php?action=parse&format=json&callback=JSON_CALLBACK&page=' + data);
        }
    };
}]);