/* global app */

app.factory('birdApi', ['$http', function($http){
    
    var urlBirds = 'https://api.myjson.com/bins/2ncjk';
    var urlTaxonomy = 'https://birds.faircloth-lab.org/api/v1/species/common/';
    
    return {
        getBirds : function() {
            return $http.get(urlBirds);
        },
        
        getTaxonomy : function(data) {
            return $http.get(urlTaxonomy + '/' + data);
        },
        
        getDuckEngine : function(data) {
            return $http.jsonp('https://api.duckduckgo.com/?q=' + data + '&format=json&callback=JSON_CALLBACK&pretty=1');
        }
    };
}]);