/* global app */

app.factory('Api', ['$resource', function($resource){
    return {
        Capture: $resource('/api/captures/:id', {id: '@id'})
    }
}])