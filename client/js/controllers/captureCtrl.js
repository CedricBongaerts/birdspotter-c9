/* global app */

app.controller('captureCtrl',[ '$scope', 'captureApi', 'auth', '$http', '$timeout', 'filepickerService', '$location', 'birdApi',
function($scope, captureApi, auth, $http, $timeout, filepickerService, $location, birdApi){
    
    $scope.form = {};
    $scope.auth = auth;
    // $scope.disable = null;
    
    $scope.options = {};
    $scope.options.watchEnter = true;
    
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

    birdApi.getBirds().then(function(res) {
        $scope.birds = res.data;
    });

    $scope.addToDatabase = function(){  
        
        var dataObj = {
                type     : $scope.captureType,
                birdname : $scope.birdname,
                place    : $scope.place,
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