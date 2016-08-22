/* global app google */

app.controller('captureCtrl',[ '$scope', 'captureApi', 'auth', '$http', '$timeout', 'filepickerService', '$location', 'birdApi', 'userApi', 'Notification',
function($scope, captureApi, auth, $http, $timeout, filepickerService, $location, birdApi, userApi, Notification){
    
    /* ----------------------- Variables ----------------------- */
    $scope.form = {};
    $scope.auth = auth;
    $scope.details = "";
    $scope.options = {};
    $scope.options.watchEnter = true;
    $scope.locationMessage = undefined;
    $scope.birdPreview = false;
    $scope.reverse = true;
    
    /* ----------------------- Birdname Operations ----------------------- */
    $scope.toggleBirdname = function() {
        if($scope.checked)
        {
            $scope.birdname = 'Unknown';
            $scope.noResults = false;
            $scope.birdPreview = false;
        } else {
            $scope.birdname = null;
        }
        return $scope.birdname;
    };

    $scope.onUCUploadComplete = function(info) {
        $scope.capture = {};
        $scope.capture.picture = "https://ucarecdn.com/" + info.uuid + "/";
        $scope.capture.uuid = info.uuid;
        $scope.capture.info = info;
        console.log(info.originalImageInfo.geo_location);
        if(info.originalImageInfo.geo_location !== null) {
            $scope.locationMessage = "Location found! Loading";
            var latLng = new google.maps.LatLng(info.originalImageInfo.geo_location.latitude, info.originalImageInfo.geo_location.longitude);
            $scope.capture.latitude = info.originalImageInfo.geo_location.latitude;
            $scope.capture.longitude = info.originalImageInfo.geo_location.longitude;
            $scope.autoGeolocation = true;
            var geocoder = new google.maps.Geocoder();
                geocoder.geocode({ 'latLng': latLng }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            var geoLocation = results[1];
                            $scope.place = geoLocation;
                            $scope.locationMessage = undefined;
                            $scope.$apply();
                        } 
                    }
                });
        }
        
        if(info.originalImageInfo.geo_location === null) {
            $scope.place = undefined;
            $scope.$apply();
        }
        
        console.log('------ Capture Info ------');
        console.log($scope.capture.info);
        console.log('------Capture Info End------');
    }
    

    /* ----------------------- Populate Birds input ----------------------- */
    birdApi.getBirds().then(function(res) {
        $scope.birds = res.data;
    });
    
    /* ----------------------- Bird Preview Infomation -------------------- */
    
    $scope.birdPreviewInfo = function(birdname,noResults) {
        if(noResults === false ){
        birdApi.getDuckEngine(birdname)
        .then(function(res) {
            console.log(res.data);
            $scope.birdPreview = true;
            $scope.previewBirdName = res.data.Heading;
            if(res.data.Image===""){
                $scope.previewBirdImage = '/img/NoPreview.jpg'
            } else {
                $scope.previewBirdImage = res.data.Image;
            }
            $scope.previewBirdInfo = res.data.Abstract;
        });
        } else {
            $scope.birdPreview = false;
            $scope.birdname = null;
            console.log(noResults);
        }
        console.log($scope.birdPreviews);
    };
    
    $scope.showBirdPreview = function() {
        $scope.birdPreviews=!$scope.birdPreviews;
        $scope.reverse = !$scope.reverse;
    }
    
        
    /* ----------------------- Post Capture to Database ----------------------- */
    $scope.addToDatabase = function() {  
        var dataObj = {
                birdname        : $scope.birdname,
                place           : $scope.place.formatted_address,
                note            : $scope.note,
                userId          : $scope.auth.profile.user_id,
                author          : $scope.auth.profile.name,
                picture         : $scope.capture.picture,
                picture_uuid    : $scope.capture.uuid
        };
        
    
        
        captureApi.insertCapture(dataObj)
            .then(function(res){
                var id = res.data._id;
                
                if(res.data.birdname==="Unknown") {
                    var unknownDataObj = {
                        place           : $scope.place.formatted_address,
                        author          : $scope.auth.profile.name,
                        picture         : $scope.capture.picture,
                        picture_uuid    : $scope.capture.uuid,
                        original_id     : id
                    };
                    
                    captureApi.insertUnknownCapture(unknownDataObj)
                    .then(function(res){
                        console.log(res.data.original_id);
                    });
                };
                
                // NOT WORKING FULLY
                
                userApi.findFollow()
                    .then(function(res){
                        var follows = res.data;
                        console.log(follows);
                        follows.filter(function(follow) {
                            return follow.followed_id === auth.profile.user_id;
                            }).forEach(function(follow) {
                            var followerId = follow.follower_id;
                            var notiObj = {
                                notificationFor     : followerId,
                                notificationFrom    : auth.profile.user_id,
                                concirning          : 'capture',
                                parameter           : id
                            }
                            captureApi.captureNotification(id, notiObj).then(function(res){});    
                    });
                });
                
                $location.path('detail/' + id);
                Notification.success({
                    message:'<div class="share-buttons-noti">' +
                    '<a href="https://www.facebook.com/sharer/sharer.php?u=https%3A//birdspotter-cedricbongaerts.c9users.io/%23/detail/' + id + '" target="_blank"><img src="/img/facebook-share.png" class="share-noti-button" /></a>' +
                    '<a href="https://twitter.com/home?status=https%3A//birdspotter-cedricbongaerts.c9users.io/%23/detail/' + id + '" target="_blank"><img src="/img/twitter-share.png" class="share-noti-button"/></a>' +
                    '</div>' , title: 'Your capture was placed!'});
                });
        };
}]);