/* global app */

app.controller('captureCtrl',[ '$scope', 'captureApi', 'auth', '$http', '$timeout', 'filepickerService', 
function($scope, captureApi, auth, $http, $timeout, filepickerService){

    $scope.form = {};
    $scope.auth = auth;


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


    $scope.addToDatabase = function(){      
        $scope.form = {};
        var dataObj = {
                birdname: $scope.birdname,
                place   : $scope.place,
                userId  : $scope.auth.profile.user_id,
                author  : $scope.auth.profile.name,
                picture : $scope.capture.picture.url
        };  

        $scope.captureMessage = true;

        captureApi.insertCapture(dataObj)

        $scope.birdname = "";   
        $scope.place = "";
        $scope.picture = "";
        $timeout(function() {
            $scope.captureMessage = false;
        }, 3000);
    };
}]);