/* global app */

app.controller('captureCtrl',[ '$scope', 'captureApi', 'auth', '$http', '$timeout', 'filepickerService', '$location', 'birdApi',
function($scope, captureApi, auth, $http, $timeout, filepickerService, $location, birdApi){
    
    /* ----------------------- Variables ----------------------- */
    $scope.form = {};
    $scope.auth = auth;
    $scope.details = "";
    $scope.options = {};
    $scope.options.watchEnter = true;
    $scope.locationMessage = undefined;
    
    /* ----------------------- Birdname Operations ----------------------- */
    $scope.toggleBirdname = function() {
        if($scope.checked)
        {
            $scope.birdname = 'Unknown';
            $scope.noResults = false;
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
            $scope.locationMessage = "Location found! Loading"
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
    
        
    /* ----------------------- Post Capture to Database ----------------------- */
    $scope.addToDatabase = function(){  
        var dataObj = {
                birdname        : $scope.birdname,
                place           : $scope.place.formatted_address,
                note            : $scope.note,
                userId          : $scope.auth.profile.user_id,
                author          : $scope.auth.profile.name,
                picture         : $scope.capture.picture,
                picture_uuid    : $scope.capture.uuid
        };
        
        if($scope.birdname==="Unknown") {
            var unknownDataObj = {
                place           : $scope.place.formatted_address,
                author          : $scope.auth.profile.name,
                picture         : $scope.capture.picture,
                picture_uuid    : $scope.capture.uuid
            };
            
            captureApi.insertUnknownCapture(unknownDataObj)
            .then(function(res){});
        }
        
        captureApi.insertCapture(dataObj)
            .then(function(res){
                var id = res.data._id;
                $location.path('detail/' + id);
            });
    };
}]);