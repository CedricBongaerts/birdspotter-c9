/* global app */

app.controller('captureCtrl',[ '$scope', 'captureApi', 'auth', '$http', '$timeout', 
    function($scope, captureApi, auth, $http, $timeout){
        
        $scope.form = {};
        $scope.auth = auth;
        
        
            $scope.addToDatabase = function(){		
        		$scope.form = {};
        		var dataObj = {
        		        birdname: $scope.birdname,
        				place : $scope.place,
        				userId : $scope.auth.profile.user_id
        		};	
        		
        		$scope.captureMessage = true;
        		
        		captureApi.insertCapture(dataObj)
        		    .then(function (res) {
        		        $scope.insertMessage = 'Capture added: ' + dataObj;
                    }, function(err) {
                        $scope.insertMessage = 'Unable to insert customer: ' + err.message;
                    });	
    
        		$scope.birdname = "";   
        		$scope.place = "";
        		$timeout(function() {
                    $scope.captureMessage = false;
                }, 3000);
        	};
    }]);