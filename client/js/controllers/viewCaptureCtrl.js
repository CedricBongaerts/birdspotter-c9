/* global app */

app.controller('viewCaptureCtrl', ['$scope',  '$stateParams', '$http', 'captureApi', 'auth', 'voteApi', '$location', '$ngBootbox', 'birdApi', 'commentApi', '$state', '$filter', '$anchorScroll', '$timeout', 'birdsuggestionApi',
                function($scope, $stateParams, $http, captureApi, auth, voteApi, $location, $ngBootbox, birdApi, commentApi, $state, $filter, $anchorScroll, $timeout, birdsuggestionApi) {

    /* ----------------------- Variables ----------------------- */
    var id = $stateParams.id;
     
    $scope.id = $stateParams.id;
    $scope.auth = auth;
     
    $scope.liked = false;
    $scope.like = false;
     
    /* ----------------------- Process Data ----------------------- */
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
                
                // Check suggestions
                var currentSuggestions = res.data.birdsuggestions;
                $scope.showsuggestions = currentSuggestions.some(function(suggestion){
                  return suggestion.userId === auth.profile.user_id && $scope.capture.birdname==='Unknown';
                });
                
                // var currentSuggestions = res.data.birdsuggestions;
                // if(var i=0; i<currentSuggestions.length;i++) {
                //     if(currentSuggestions[i].userId === auth.profile.user_id && $scope.capture.birdname==='Unknown') { 
                //   //is $scope.capture.birdname==='Unknown' check needed here, cause it has nothing to do with loop variables?
                //         $scope.showSuggestionButton = false;
                //         break;
                //     }
                // }
                               
               /* ----------------------------- Edit Options ----------------------------- */
               $scope.toggleBirdname = function() {
                    if($scope.checked)
                    {
                        $scope.capture.birdname = 'Unknown';
                        $scope.noResults = false;
                    } else {
                        $scope.capture.birdname = null;
                    }
                };
               
               
                if($scope.capture.birdname == 'Unknown'){
                    $scope.checked = true;
                }
                
                /* ----------------------------- POPOVER BIRDINFORMATION ----------------------------- */
                
                $scope.birdInfoPopover = {
                    content: "The user doesn't know the birdname. If you know it, give it down below!",
                    templateUrl: '/partials/model/birdPopover.html',
                    title: $scope.capture.birdname,
                };

                
                /* -------------------------- Check if voted unlike Capture -------------------------- */
                // Check voted
                
                var votes = res.data.votes;

                if(votes.length == 0){$scope.like = true;}
                votes.forEach(function(vote){
                    if(vote.userId === auth.profile.user_id) {
                        $scope.liked = true;
                        
                    } 
                });
                $scope.like = !$scope.liked;
                    
                        
                        
                // Unlike
                $scope.unlikeCapture = function(){

                    votes.forEach(function(vote){
                    if(vote.userId === auth.profile.user_id) {
                        var voteId = vote._id;
                    
                        voteApi.unlikeCapture(voteId).then(function(res) {});
                            $scope.capture.votes.length--;
                            $scope.liked = false;
                            $scope.like = true;
                        }
                    });
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

        var likeObj = {
             userId      : $scope.auth.profile.user_id,
             userName    : $scope.auth.profile.name,
             votedFor    : $scope.capture.userId
        };
        
        var notificationObj = {
                            notificationFor     : $scope.capture.userId,
                            notificationFrom    : auth.profile.user_id,
                            concirning          : 'like',
                            parameter           : id
        };
        
        captureApi.likeCapture(id, likeObj)
            .then(function(res){
                    $scope.capture.votes.push(res);
                    $scope.liked = true;
                    $scope.like = false;
                    
                    var likeId = res.data._id;
                    console.log(likeId);
                if($scope.capture.userId !== auth.profile.user_id) {
                    voteApi.voteNotification(likeId, notificationObj)  
                    .then(function(res){
                        console.log(notificationObj);
                        console.log(likeId);
                    });
                }
            });
            
    };
          
    /* --------------------------------- Add comment ------------------------------------ */       
    $scope.addComment = function(){
        if($scope.comment === undefined) {
            return;
        }
        var commentObj = {
            comment           : $scope.comment,
            userId            : $scope.auth.profile.user_id,
            author            : $scope.auth.profile.name
        };  
        
        var notificationObj = {
                            notificationFor     : $scope.capture.userId,
                            notificationFrom    : auth.profile.user_id,
                            concirning          : 'comment',
                            parameter           : id
        };
        
        
        captureApi.postComment(id, commentObj)  
            .then(function(res){
                console.log(res.data);
                $scope.capture.comments.push(res.data);
                var commentId = res.data._id;
                console.log(commentId);
            if($scope.capture.userId !== auth.profile.user_id) {    
                    commentApi.commentNotification(commentId, notificationObj)  
                    .then(function(res){
                        console.log(notificationObj);
                        console.log(commentObj);
                });
            }
        });
        
        $scope.comment = undefined;
    };
    $scope.commentsShow = function() {
        $scope.comments=!$scope.comments;
        $timeout(function() {
            $location.hash('bottom');
            $anchorScroll();
            console.log('scrolling down');
        }, 250);
    };
    
    /* --------------------------------- Add Birdsuggestion ----------------------------------- */
        
    $scope.birdSuggestionInfo = function(birdSuggestion,noResults) {
        if(noResults === false ){
        birdApi.getDuckEngine(birdSuggestion)
        .then(function(res) {
            console.log(res.data);
            $scope.suggestionBirdName = res.data.Heading;
            $scope.suggestionBirdImage = res.data.Image;
            $scope.suggestionBirdInfo = res.data.Abstract;
        });
        } else {
            $scope.birdSuggestion = '';
            console.log(noResults
            )
        }
    };
    
    $scope.addBirdSuggestion = function(){
        if(this.noResults === true) {
            $scope.birdSuggestion = '';
            return;
        }
        
        if($scope.birdSuggestion === undefined) {
            return;
        }
        var birdsuggestionObj = {
            birdSuggestion    : $scope.birdSuggestion,     
            userId            : $scope.auth.profile.user_id,
            author            : $scope.auth.profile.name
        };  
        
        // var notificationObj = {
        //                     notificationFor     : $scope.capture.userId,
        //                     notificationFrom    : auth.profile.user_id,
        //                     concirning          : 'birdsuggestion',
        //                     parameter           : id
        // };
        
        
        
        captureApi.postBirdsuggestion(id, birdsuggestionObj)  
            .then(function(res){
                $ngBootbox.hideAll();
                $state.transitionTo($state.current, $stateParams, {
                        reload: true,
                        inherit: false,
                        notify: true
                    });
                $scope.birdSuggestion = undefined;
        });
    };
    
    $scope.addBirdSuggestion = function(){
        if(this.noResults === true) {
            $scope.birdSuggestion = '';
            return;
        }
        
        if($scope.birdSuggestion === undefined) {
            return;
        }
        var birdsuggestionObj = {
            birdSuggestion    : $scope.birdSuggestion,     
            userId            : $scope.auth.profile.user_id,
            author            : $scope.auth.profile.name
        };  
        
        
        captureApi.postBirdsuggestion(id, birdsuggestionObj)  
            .then(function(res){
                $ngBootbox.hideAll();
                $state.transitionTo($state.current, $stateParams, {
                        reload: true,
                        inherit: false,
                        notify: true
                    });
                $scope.birdSuggestion = undefined;
        });
    };
    
    
    /* --------------------------------- Edit Capture ----------------------------------- */
    $scope.editCapture = function(){  
        var dataObj = {
            birdname : $scope.capture.birdname,
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
    
    /* ------------------------------- Birdlist link -------------------------------------*/
    $scope.searchBird = function() {
      $state.go('birdlist' , {bird: this.capture.birdname});
    };
    
    /* ------------------------------- Show Image Preview ------------------------------ */
    $scope.imgPreviewShow = false;
    
    $scope.showImgPreview = function() {
        $scope.imgPreviewShow = true;
        $scope.thisCapture = this.capture;
    }
    
    $scope.closeImgPreview = function() {
        $scope.imgPreviewShow = false;
    }
    
    /* ------------------------------- Show Maps ---------------------------------------- */
    $scope.mapShow = false;
    $scope.birdLocation = "Antwerpen";
    
    $scope.showGoogleMap = function() {
        $scope.mapShow = true;
        $scope.birdLocation = this.capture.place;
        console.log($scope.birdLocation);
    };
    
    $scope.closeMap = function() {
        $scope.mapShow = false;
        console.log('did something');
    };
}]);