/* global app */

app.controller('viewCaptureCtrl', ['$scope',  '$stateParams', '$http', 'captureApi', 'auth', 'voteApi', '$location', '$ngBootbox', 'birdApi', 'commentApi', '$state',
                function($scope, $stateParams, $http, captureApi, auth, voteApi, $location, $ngBootbox, birdApi, commentApi, $state) {

     var id = $stateParams.id;
     
     $scope.id = $stateParams.id;
     $scope.auth = auth;
     
     $scope.liked = false;
     $scope.like = false;
     
     birdApi.getBirds().then(function(res) {
        $scope.birds = res.data;
    });
     
     captureApi.findCapture(id)
          .then(function(res) {
               $scope.capture = res.data;
                //console.log(res.data);
                
                /* ---------------- Check owner Capture & Delete Capture ----------------- */
                // Check owner
                if($scope.capture.userId == auth.profile.user_id) {
                    $scope.postAuthor = true;
                }
                
                // Delete Capture & redirect
                $scope.deleteCapture = function() {
                    captureApi.deleteCapture(id)
                        .then(function(res) {
                            $location.path('/dashboard');
                            console.log('Deleted Capture');
                    });
                };
               
               /* ----------------------------- Edit Options ----------------------------- */
               $scope.toggleBirdname = function() {
                    if($scope.checked)
                    {
                        $scope.newBirdname = 'Unknown';
                        $scope.noResults = false;
                    } else {
                        $scope.newBirdname = null;
                    }
                };
               
               
                if($scope.capture.birdname == 'Unknown'){
                    $scope.checked = true;
                }
                
                /* ----------------------------- POPOVER BIRDINFORMATION ----------------------------- */
                
                // Top page popover
                if($scope.capture.birdname!=='Unknown') {
                    birdApi.getDuckEngine($scope.capture.birdname)
                    .then(function(res) {
                        $scope.birdName = res.data.Heading;
                        $scope.birdInfo = res.data.Abstract;
                        $scope.birdImage = res.data.Image;
                        // console.log(res.data);
                        // console.log($scope.birdInfo);
                        // console.log($scope.birdImage);
                        $scope.birdInfoPopover = {
                            image: $scope.birdImage,
                            content: $scope.birdInfo,
                            templateUrl: '/partials/model/birdPopover.html',
                            title: $scope.birdName
                       };
                    });
                } else {
                    $scope.birdInfoPopover = {
                            content: "The user doesn't know the birdname. If you know it, give it down below!",
                            templateUrl: '/partials/model/birdPopover.html',
                            title: $scope.capture.birdname
                       };
                }  
                
                $scope.birdSuggestionInfo = function(birdSuggestion) {
                    birdApi.getDuckEngine(birdSuggestion)
                    .then(function(res) {
                        console.log(res.data);
                        $scope.suggestionBirdName = res.data.Heading;
                        $scope.suggestionBirdImage = res.data.Image;
                        $scope.suggestionBirdInfo = res.data.Abstract;
                        $scope.suggestionBirdInfoPopover = {
                            title: $scope.suggestionBirdName,
                            image: $scope.suggestionBirdImage,
                            content: $scope.suggestionBirdInfo,
                            templateUrl: '/partials/model/birdPopover.html'
                       };
                    });
                };
                
                
                /* -------------------------- Check if voted unlike Capture -------------------------- */
                // Check voted
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
                        
                // Unlike
                $scope.unlikeCapture = function(){
                    var i;
                    for (i=0; i<votes.length; i++)
                    {
                        if(votes[i].userId == auth.profile.user_id) {
                           
                            var voteId = votes[i]._id;
                            
                            voteApi.unlikeCapture(voteId).then(function(res) {
                            });
                            $scope.liked = false;
                            $scope.like = true;
                            $scope.capture.votes.length--;
                            break;
                        } 
                    }
                };
            
                /* --------------------------------- Delete comment ----------------------------------- */
                $scope.deleteComment = function(index) {
                    commentApi.deleteComment($scope.capture.comments[index]._id)
                        .then(function(res) {});
                        $scope.capture.comments.splice(index, 1);
                    };
        });
    
    /* --------------------------------- Like Capture ----------------------------------- */              
    $scope.likeCapture = function(){

        var dataObj = {
             userId      : $scope.auth.profile.user_id,
             userName    : $scope.auth.profile.name,
             votedFor    : $scope.capture.userId
        };
        captureApi.likeCapture(id, dataObj)
            .success(function(res){
                    $scope.capture.votes.push(res);
                    $scope.liked = true;
                    $scope.like = false;
            });
    };
          
    /* --------------------------------- Add comment ------------------------------------ */       
    $scope.addComment = function(){
          console.log($scope.birdSuggestion);
        var dataObj = {
            comment           : $scope.comment,
            birdSuggestion    : $scope.birdSuggestion,     
            userId            : $scope.auth.profile.user_id,
            author            : $scope.auth.profile.name
        };  
        
        captureApi.postComment(id, dataObj)  
            .then(function(res){
                $scope.capture.comments.push(res.data);
        });
        $scope.comment = "";
        $scope.birdSuggestion = "";
    };
    
    /* --------------------------------- Edit Capture ----------------------------------- */
    $scope.editCapture = function(){  
        var dataObj = {
            birdname : $scope.newBirdname,
            note     : $scope.capture.note
        };
        
        console.log(dataObj);
        captureApi.editCapture(id, dataObj)
        .then(function(res) {
            $state.transitionTo($state.current, $stateParams, {
                reload: true,
                inherit: false,
                notify: true
            });
            $ngBootbox.hideAll();
        });
    };
    
    /* ------------------------------- Cancel Bootbox ----------------------------------- */
    $scope.cancel = function() {
        $ngBootbox.hideAll();
    };
}]);