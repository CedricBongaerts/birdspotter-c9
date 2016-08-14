/* global app angular*/

app.controller('birdlistCtrl', ['$scope',  '$stateParams', '$http', 'userApi', 'auth', 'captureApi', 'birdApi', '$filter', '$q',
                function($scope, $stateParams, $http, userApi, auth, captureApi, birdApi, $filter, $q) {
                    
    /* ----------------------- Variables ----------------------- */
    $scope.duckInfo = false;
    $scope.birdname = $stateParams.bird;
    $scope.namedPageSize = 3;
    $scope.unknownPageSize = 10;
    $scope.currentPage = 1;
    $scope.noBirdCaptures = false;
    
    /* ----------------------- Retrieve BirdApi ----------------------- */
    function getBirdInformation() {
        var wikiBaseUrl = "http://en.wikipedia.org";
        if($scope.birdname!=='Unknown') {
            var lowercaseBirdname = $filter('lowercase')($scope.birdname);
            birdApi.getWikipedia(lowercaseBirdname)
            .then(function(res) {
                console.log(res);
                
                if(res.data.parse === undefined) {
                    birdApi.getDuckEngine(lowercaseBirdname)
                    .then(function(res) {
                        $scope.abstractInfo = res.data.Abstract;
                        $scope.birdImage = res.data.Image;
                        $scope.abstractUrl = res.data.AbstractURL;
                        $scope.duckInfo = true;
                    });
                } else {
                $scope.duckInfo = false;    
                var html = res.data.parse.text['*'];
                 // create a div and append html data
                 var div = angular.element('<div>').append(html),
                 // create collection of the `<a>` elements 
                 links = div.find('a');
                 // loop over `<a>` elements and adjust href
                 for(var i =0; i<links.length; i++ ){
                   var el = links[i];
                   var $link =angular.element(el) , href = $link.attr('href');
                   if(href[0] ==='/'){
                     // set absolute URL.
                     $link.attr('href', wikiBaseUrl + href);
                   }
                   
                   $link.attr('target','_blank');
                 }
                 // return the modified html string from the div element
                 $scope.html = div.html();
                }
            });
        } else {
            $scope.html = "";
        }
    }
    getBirdInformation();
    
    /* ----------------------- Process Data ----------------------- */
    $q.all({ birds: getBirds(), captures: getAllCaptures() }).then(function(collections) {
        $scope.birds = collections.birds;
        var captures = collections.captures;
        console.log(captures);
        showSelectedCaptures();
        
        function showSelectedCaptures() {
            
            $scope.selectedCaptures = [];
                captures.filter(function(capture){
                    return $scope.birdname === capture.birdname;
                }).forEach(function(capture) {
                   $scope.selectedCaptures.push(capture); 
                });
                console.log($scope.selectedCaptures);
                
                if($scope.selectedCaptures.length === 0) {
                    $scope.noBirdCaptures = true;
                }
        }
    });
    
    /* ----------------------- Retrieve Services - Data ----------------------- */
    function getBirds() {
        return birdApi.getBirds().then(function(res) {
            return res.data;
        });
    }
    
    function getAllCaptures() {
        return captureApi.getAllCaptures().then(function(res) {
            return res.data;
        });
    }
}]);