/* global app */

app.controller('viewCaptureCtrl', ['$scope',  '$stateParams', '$http', 'captureApi', 'auth', function($scope, $stateParams, $http, captureApi, auth) {

     var id = $stateParams.id;
     $scope.auth = auth;
     
     captureApi.findCapture(id)
          .then(function(res) {
               $scope.capture = res.data;
               console.log($scope.capture);
          });
          
          
     console.log($scope.capture);
          
     $scope.addComment = function(){
          
          var dataObj = {
               body    : $scope.body,
               userId  : $scope.auth.profile.user_id,
               author  : $scope.auth.profile.name
          };  
          
          captureApi.postComment(id, dataObj)  
               .then(function(res){
                    console.log('something');
                    $scope.capture.comments.push(res);
                    $scope.capture.comments.$apply();
                    console.log($scope.capture.comments);
          });
           $scope.body = "";
     };
}]);