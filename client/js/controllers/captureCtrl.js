/* global app */

app.controller('captureCtrl',[ '$scope', 'captureApi', 'auth', '$http', '$timeout', 'filepickerService', '$location', 'birdApi',
function($scope, captureApi, auth, $http, $timeout, filepickerService, $location, birdApi){
    
    $scope.form = {};
    $scope.auth = auth;
    $scope.disable = null;
    $scope.captureType = 'ok';
    
    $scope.options = {};
    $scope.options.watchEnter = true;
    
    $scope.toggleType = function() {
        if($scope.checked == true)
        {
            $scope.birdname = 'Unknown';
            $scope.captureType = 'question';
        } else {
            $scope.birdname = null;
            $scope.captureType = 'ok';
        }
        return $scope.birdname, $scope.type;
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