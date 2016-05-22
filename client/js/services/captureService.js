/* global app */

app.factory('captureApi', ['$http', function($http){
    
    var urlBase = 'https://birdspotter-cedricbongaerts.c9users.io/api/captures';
    var captureApi = {}
    
    captureApi.getCaptures = function () {
        return $http.get(urlBase);
    }
    
    captureApi.insertCapture = function(dataObj) {
        return $http.post(urlBase, dataObj)
    }
    
    return captureApi;
}])