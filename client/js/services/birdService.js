/* global app */

app.factory('birdApi', ['$http', function($http){
    
    var urlBirds = 'https://api.myjson.com/bins/2ncjk';
    var urlTaxonomy = 'http://birds.faircloth-lab.org/api/v1/species/common/';
    
    return {
        getBirds : function() {
            return $http.get(urlBirds);
        },
        
        getTaxonomy : function(data) {
            return $http.get(urlTaxonomy + '/' + data);
        },
        
        getDuckEngine : function(data) {
            return $http.get('http://api.duckduckgo.com/?q=' + data + '&format=json&pretty=1')
        }
    };
}]);