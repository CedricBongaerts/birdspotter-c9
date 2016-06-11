/* global app */

app.controller('viewCaptureCtrl', ['$scope',  '$stateParams', '$http', 'captureApi', 'auth', 'voteApi', '$location', '$ngBootbox', 'birdApi', 'commentApi', '$state', '$uibModal', '$filter',
                function($scope, $stateParams, $http, captureApi, auth, voteApi, $location, $ngBootbox, birdApi, commentApi, $state, $uibModal, $filter) {

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
                
                // Top page popover
                if($scope.capture.birdname!=='Unknown') {
                     var lowercaseBirdname = $filter('lowercase')($scope.capture.birdname);
                    console.log(lowercaseBirdname);
                    birdApi.getDuckEngine(lowercaseBirdname)
                    .then(function(res) {
                        $scope.birdName = res.data.Heading;
                        $scope.birdInfo = res.data.Abstract;
                        $scope.birdImage = res.data.Image;
                       
                        console.log(res.data);
                        console.log($scope.birdInfo);
                        console.log($scope.birdImage);
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
                            title: $scope.capture.birdname,
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
                        
                        voteApi.unlikeCapture(voteId).then(function(res) {
                            });
                            $scope.liked = false;
                            $scope.like = true;
                            $scope.capture.votes.length--;
                        }
                    });
                };
            
                /* --------------------------------- Delete comment ----------------------------------- */
                $scope.deleteComment = function(index) {
                    commentApi.deleteComment($scope.capture.comments[index]._id)
                        .then(function(res) {});
                        $scope.capture.comments.splice(index, 1);
                    };
                    
                $scope.openImageModel = function() {
                    $uibModal.open({
                        animation: true,
                        templateUrl: '/partials/model/birdImageModal.html'
                    });
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

                voteApi.voteNotification(likeId, notificationObj)  
                .then(function(res){
                    console.log(notificationObj);
                    console.log(likeId);
                });
            });
            
    };
          
    /* --------------------------------- Add comment ------------------------------------ */       
    $scope.addComment = function(){
        var commentObj = {
            comment           : $scope.comment,
            birdSuggestion    : $scope.birdSuggestion,     
            userId            : $scope.auth.profile.user_id,
            author            : $scope.auth.profile.name
        };  
        
        var notificationType;
        
        if(commentObj.birdSuggestion == undefined) {
            notificationType = 'comment';
        } else {
            notificationType = 'birdsuggestion';
        }
        
        var notificationObj = {
                            notificationFor     : $scope.capture.userId,
                            notificationFrom    : auth.profile.user_id,
                            concirning          : notificationType,
                            parameter           : id
        };
        
        
        captureApi.postComment(id, commentObj)  
            .then(function(res){
                $scope.capture.comments.push(res.data);
                var commentId = res.data._id;
                console.log(commentId);
                
                commentApi.commentNotification(commentId, notificationObj)  
                .then(function(res){
                    console.log(notificationObj);
                    console.log(commentObj);
            });
        });
        
        $scope.comment = undefined;
        $scope.birdSuggestion = undefined;
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
}]);