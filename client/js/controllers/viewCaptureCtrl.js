/* global app */

app.controller('viewCaptureCtrl', ['$scope',  '$stateParams', '$http', 'captureApi', 'auth', 'voteApi', '$location', '$ngBootbox', 'birdApi', 'commentApi',
                function($scope, $stateParams, $http, captureApi, auth, voteApi, $location, $ngBootbox, birdApi, commentApi) {

     var id = $stateParams.id;
     $scope.auth = auth;
     
     $scope.liked = false;
     $scope.like = false;
     
     birdApi.getBirds().then(function(res) {
        $scope.birds = res.data;
    });
     
     captureApi.findCapture(id)
          .then(function(res) {
               $scope.capture = res.data;
               var votes = res.data.votes;
                    var i;
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
                $scope.postAuthor = true;
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
            
             $scope.deleteComment = function(commentId) {
                 commentApi.deleteComment(commentId)
                    .then(function(res) {
                       console.log('deleted comment');
                    });
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
            suggestedBirdname : $scope.suggestedBirdname,
            body              : $scope.body,
            userId            : $scope.auth.profile.user_id,
            author            : $scope.auth.profile.name
        };  
        
        captureApi.postComment(id, dataObj)  
            .then(function(res){
                $scope.capture.comments.push(res);
        });
        $scope.body = "";
    };
    
     
}]);