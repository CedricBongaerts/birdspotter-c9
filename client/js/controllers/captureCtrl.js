/* global app */

app.controller('captureCtrl',[ '$scope', 'captureApi', 'auth', '$http', '$timeout', 'filepickerService', '$location', 'birdApi',
function($scope, captureApi, auth, $http, $timeout, filepickerService, $location, birdApi){
    
    /* ----------------------- Variables ----------------------- */
    $scope.form = {};
    $scope.auth = auth;
    $scope.details = "";
    $scope.options = {};
    $scope.options.watchEnter = true;
    
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

    /* ----------------------- Upload Image Operations ----------------------- */
    $scope.upload = function(){
        filepickerService.pick(
            {
                mimetype: 'image/*',
                language: 'en',
                services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE', 'FACEBOOK', 'INSTAGRAM'],
                openTo: 'COMPUTER'
            },
            function(Blob){
                console.log(JSON.stringify(Blob));
                $scope.capture = {};
                $scope.capture.picture = Blob;
                $scope.$apply();
            }
        );
    };

    /* ----------------------- Populate Birds input ----------------------- */
    birdApi.getBirds().then(function(res) {
        $scope.birds = res.data;
    });

    /* ----------------------- Post Capture to Database ----------------------- */
    $scope.addToDatabase = function(){  
        
        var dataObj = {
                type     : $scope.captureType,
                birdname : $scope.birdname,
                place    : $scope.place.formatted_address,
                note     : $scope.note,
                userId   : $scope.auth.profile.user_id,
                author   : $scope.auth.profile.name,
                picture  : $scope.capture.picture.url
        };
        
        captureApi.insertCapture(dataObj)
            .then(function(res){
                var id = res.data._id;
                $location.path('detail/' + id);
            });
    };
}]);