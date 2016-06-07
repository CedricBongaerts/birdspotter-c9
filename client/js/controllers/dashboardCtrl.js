/* global app */
app.controller('dashboardCtrl', ['$scope', '$http', 'captureApi', 'userApi', 'filterFilter', '$q', 'auth', 
                        function ($scope, $http, captureApi, userApi, filterFilter, $q, auth) {
                    
    $scope.captures = [];
    $scope.pageSize = 4;
    $scope.currentPage = 1;
    $scope.topPosters = [];
    $scope.auth = auth;
    
    $scope.getCount = function getCount(strCat) {
        return filterFilter($scope.captures, {userId: strCat}).length;
    };
    
    $q.all({captures: getAllCaptures(), users: getUsers()}).then(function(collections) {
        $scope.captures = collections.captures;
        return collections.users;
    }).then(function (users) {
        $scope.topPosters = users.map(function(user) {
            //I think your user has propery "id" or similar
            return {
                user: user,
                amountPosted: $scope.getCount(user.user_id)
            };
        });
    });
    
    function getAllCaptures() {
        return captureApi.getAllCaptures().then(function (res) {
            return res.data;
        });
    }
    
    function getUsers() {
        return userApi.getUsers().then(function (res) {
            return res.data.users;
        });
    }

}]);

// app.controller('dashboardCtrl', ['$scope', '$http', 'captureApi', 'userApi', 'filterFilter', '$q', function($scope, $http, captureApi, userApi, filterFilter, $q){
//     $scope.captures = [];
//     $scope.pageSize = 4;
//     $scope.currentPage = 1;
    
//     $scope.topPosters = [];

//     captureApi.getAllCaptures().then(function(res) {
//         $scope.captures = res.data;
        
//         $scope.getCount = function getCount(strCat){
//                     return filterFilter( $scope.captures, {userId:strCat}).length;
//                 };    
        
//         userApi.getUsers().then(function(res){
            
//         var users = res.data.users;
//             var i;
//             for(i=0; i<users.length; i++) {
//                 var userId = users[i].user_id;
//                 var user = users[i];

//                 var dataObj = {
//                     user :  user,
//                     amountPosted : $scope.getCount(userId)
//                     };
                     
//                     $scope.topPosters.push(dataObj);
//             }
//         });
//     });
// }]);
