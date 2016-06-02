/* global app*/

app.controller('taxonomyCtrl', ['$scope', '$http', 'birdApi', function($scope, $http, birdApi) {
    birdApi.getBirds().then(function(res) {
        $scope.birds = res.data;
    });
    
    
    $scope.findBird = function(){  
        var birdname = $scope.birdname;
        
      $http.jsonp('https://api.duckduckgo.com/?q=' + birdname + '&format=json&callback=JSON_CALLBACK&pretty=1').then(function(res){
            var result = res.data;
            console.log(res.data);
            $scope.birdImage = result.Image;
            $scope.birdInfo = result.AbstractText;
            $scope.wikiLink = result.AbstractURL;
            
            if($scope.birdImage !== "") 
            {
                $scope.imageShow = true;
            } else { 
                $scope.imageShow = false;
            }
            
            if($scope.birdInfo !== "" || $scope.wikiLink !== "")
            {
                $scope.infoShow = true;
            } else {
                $scope.infoShow = false;
            }
        });
    };
}]);