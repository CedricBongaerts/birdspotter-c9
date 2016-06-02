/* global app */

app.controller('viewCaptureCtrl', ['$scope',  '$stateParams', '$http', 'captureApi', 'auth', 'voteApi', '$location', '$ngBootbox', 
                function($scope, $stateParams, $http, captureApi, auth, voteApi, $location, $ngBootbox) {

     var id = $stateParams.id;
     $scope.auth = auth;
     
     $scope.liked = false;
     $scope.like = false;
     
     captureApi.findCapture(id)
          .then(function(res) {
               $scope.capture = res.data;
               var votes = res.data.votes;
                    var i;
                    console.log(votes.length);
                    if(votes.length == 0) {
                        $scope.like = true;
                    } else {
                        for (i=0; i<votes.length; i++)
                        {
                            if(votes[i].userId == auth.profile.user_id) {
                                  $scope.liked = true;
                                  break;
                          } else {if((i+1) == votes.length){
                                  $scope.like = true;
                                }
                          }
                        }
                    }
               
            $scope.unlikeCapture = function(){
                var i;
                for (i=0; i<votes.length; i++)
                {
                    if(votes[i].userId == auth.profile.user_id) {
                       
                        var voteId = votes[i]._id;
                        
                        $http.delete('https://birdspotter-cedricbongaerts.c9users.io/api/votes/'+ voteId);
                          $scope.liked = false;
                          $scope.like = true;
                          break;
                    } 
                }
            };
            
            if($scope.capture.userId == auth.profile.user_id) {
                $scope.author = true;
            }
            
            $scope.deleteCapture = function() {
                captureApi.deleteCapture(id)
                    .then(function(res) {
                        $location.path('/dashboard');
                        console.log('Deleted Capture');
                });
            };
            
            $scope.cancelDelete = function() {
                return;
            };
        });

          
    $scope.likeCapture = function(){

        var dataObj = {
             userId      : $scope.auth.profile.user_id,
             userName    : $scope.auth.profile.name,
             votedFor    : $scope.capture.userId
        };
        captureApi.likeCapture(id, dataObj)
            .then(function(res){
                    $scope.capture.votes.push(res);
                    $scope.liked = true;
                    $scope.like = false;
            });
    };
          
    $scope.addComment = function(){
          
        var dataObj = {
            body    : $scope.body,
            userId  : $scope.auth.profile.user_id,
            author  : $scope.auth.profile.name
        };  
        
        captureApi.postComment(id, dataObj)  
            .then(function(res){
                $scope.capture.comments.push(res);
        });
        $scope.body = "";
    };
     
}]);

// app.directive('ngConfirmClick', [
//         function(){
//             return {
//                 link: function (scope, element, attr) {
//                     var msg = attr.ngConfirmClick || "Are you sure?";
//                     var clickAction = attr.confirmedClick;
//                     element.bind('click',function (event) {
//                         if ( window.confirm(msg) ) {
//                             scope.$eval(clickAction);
//                         }
//                     });
//                 }
//             };
//     }])