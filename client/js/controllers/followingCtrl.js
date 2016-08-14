/* global app */

app.controller('followingCtrl', ['$scope', '$http', 'userApi', 'auth', 'captureApi', '$q', function($scope, $http, userApi, auth, captureApi, $q) {
    
    /* ----------------------- Variables ----------------------- */    
    $scope.auth = auth;
    $scope.captures = [];
    $scope.following = [];
    $scope.nothing = false;
    $scope.notFollowing = false;
    $scope.pageSize = 10;
    $scope.currentPage = 1;

    /* ----------------------- Process Data ----------------------- */
    $q.all({follows: findFollow(), users: getUsers(), captures: getAllCaptures()}).then(function(collections) {
    var follows = collections.follows;
    var users = collections.users;
    var captures = collections.captures;
        follows.filter(function(follow) {
            return follow.follower_id === auth.profile.user_id;
            }).forEach(function(follow) {
                
            users.filter(function(user) {
                return user.user_id === follow.followed_id;
                }).forEach(function(user) {
                    $scope.following.push(user);
            });
        });
        follows.filter(function(follow) {
            return follow.follower_id === auth.profile.user_id;
            }).forEach(function(follow) {
            
            captures.filter(function(capture){
                return follow.followed_id === capture.userId;
            }).forEach(function(capture){
                    console.log(capture);
                    $scope.captures.push(capture);
            });
        });
        if($scope.captures.length === 0) {
            $scope.nothing = true;
        }
        
        if($scope.following.length === 0) {
            $scope.notFollowing = true;
        }
    });
    
    /* ----------------------- Retrieve Services - Data ----------------------- */
    function findFollow() {
        return userApi.findFollow().then(function(res) {
            return res.data;
        });
    }
    
    function getUsers() {
        return userApi.getUsers().then(function(res) {
            return res.data.users;
        });
    }
    
    function getAllCaptures() {
        return captureApi.getAllCaptures().then(function(res) {
            return res.data;
        });
    }
    
}]);