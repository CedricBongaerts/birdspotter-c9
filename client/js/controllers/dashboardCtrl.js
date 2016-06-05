/* global app */

app.controller('dashboardCtrl', ['$scope', '$http', 'captureApi', 'userApi', 'filterFilter', function($scope, $http, captureApi, userApi, filterFilter){
    $scope.captures = [];
    $scope.pageSize = 4;
    $scope.currentPage = 1;
    
    $scope.topPosters = [];
    
    
          
    captureApi.getAllCaptures().then(function(res) {
        $scope.captures = res.data;
        
        userApi.getUsers().then(function(res){
        
        $scope.getCount = function getCount(strCat){
                return filterFilter( $scope.captures, {userId:strCat}).length;
            };    
          
            var users = res.data.users;
            var i;
            for(i=0; i<users.length; i++) {
                var userId = users[i].user_id;
                console.log(userId);
                console.log($scope.getCount(userId));
                
                var dataObj = {
                    userId : userId,
                    amountPosted : $scope.getCount(userId)
                    };
                
                $scope.topPosters.push(dataObj);
            }
            console.log($scope.topPosters);
        });
        
        //  $scope.getCount = function getCount(strCat){
        //     return filterFilter( $scope.captures, {userId:strCat}).length;
        //   }
        //   console.log($scope.getCount("facebook|10153403872376529"))
        //   console.log($scope.captures);
    });
}]);