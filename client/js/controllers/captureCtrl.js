/* global app */

app.controller('captureCtrl',[ '$scope', 'captureApi', 'auth', '$http', '$timeout', 'filepickerService', '$location', 'birdApi',
function($scope, captureApi, auth, $http, $timeout, filepickerService, $location, birdApi){
    
    $scope.form = {};
    $scope.auth = auth;
    $scope.disable = null;
    $scope.captureType = 'ok';
    
    $scope.options = {};
    $scope.options.watchEnter = true;
    
    $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    
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
        
        if($scope.picture == undefined) {
            return
        }
        
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