/* global app */

app.factory('userApi', ['$http', function($http){
    
    var authUrl = 'https://cedricbongaerts.eu.auth0.com/api/v2/users?include_totals=true&include_fields=false&search_engine=v2';
    var urlBase = 'https://birdspotter-cedricbongaerts.c9users.io/api/follows';
    
    return {
        getUsers : function() {
            return $http(
            {
                method: 'GET', 
                url: authUrl, 
                headers: {'Authorization': 'Bearer '+ 
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJzQWVhS1FVbmNGM1MxdXdWZUlhNU1aVndxTHljVm1STiIsInN'  +
                'jb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbInJlYWQiXX19LCJpYXQiOjE0NjQyMDk1OTQsImp0aSI6ImM0YjBjMTg1NjE1' +
                'NzhjNDcxNjQyMTk3NDg1OTE5MWQ1In0.8Vq7Z1B_Vpa1MP8gYAyf73xGIIm_YAnVJRxE96C1ktI'},
            });
        },
        
        followUser : function(data) {
            return $http.post(urlBase, data);
        },
        
        findFollow : function() {
            return $http.get(urlBase);
        }
    };
}]);
