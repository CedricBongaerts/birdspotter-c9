/* global app */

app.factory('userApi', ['$http', '$location', function($http, $location){
    
    var authUsersUrl = 'https://cedricbongaerts.eu.auth0.com/api/v2/users?include_totals=true&include_fields=true&search_engine=v2';
    // var authUserUrl = 'https://cedricbongaerts.eu.auth0.com/api/v2/users/facebook%7C10153403872376529?include_fields=true';
    
    var urlBase = 'https://birdspotter-cedricbongaerts.c9users.io/api/follows';
    
    return {
        getUsers : function() {
            return $http(
            {
                method: 'GET', 
                url: authUsersUrl, 
                headers: {'Authorization': 'Bearer '+ 
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJzQWVhS1FVbmNGM1MxdXdWZUlhNU1aVndxTHljVm1STiIsInN'  +
                'jb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbInJlYWQiXX19LCJpYXQiOjE0NjQyMDk1OTQsImp0aSI6ImM0YjBjMTg1NjE1' +
                'NzhjNDcxNjQyMTk3NDg1OTE5MWQ1In0.8Vq7Z1B_Vpa1MP8gYAyf73xGIIm_YAnVJRxE96C1ktI'},
            });
        },
        
        getUser : function(id) {
            return $http(
            {
                method: 'GET', 
                url: 'https://cedricbongaerts.eu.auth0.com/api/v2/users/' + id + '?include_fields=true', 
                headers: {'Authorization': 'Bearer '+ 
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJzQWVhS1FVbmNGM1MxdXdWZUlhNU1aVndxTHljVm' +
                '1STiIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbInJlYWQiXX19LCJpYXQiOjE0NjUxMjEyMTYsImp0a' +
                'SI6IjgwYWU1ZGZlNDgzMmM3YmYwZWIxZjUzNzkwMDdiNGQ2In0.m6EKwk-vJrlKHwyxuV9ljYuznmXmqg8t2p-7GnThjh0'},
            }).error(function(data,status,headers,config) {
                $location.url('/error');
          });
        },
        
        followNotification : function(id, data) {
            return $http.post(urlBase + '/' + id + '/notifications', data);
        },
        
        followUser : function(data) {
            return $http.post(urlBase, data);
        },
        
        findFollow : function() {
            return $http.get(urlBase);
        },
        
        unfollowUser: function(id) {
            return $http.delete(urlBase + '/' + id);
        }
    };
}]);
