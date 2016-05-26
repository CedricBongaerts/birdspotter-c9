/* global angular */
var app = angular.module('app', 
                        [
                            'ui.router',
                            'ngResource',
                            'auth0',
                            'angular-storage',
                            'angular-jwt',
                            'ui.router.title',
                            'ngAutocomplete',
                            'ui.bootstrap',
                            'angular-filepicker',
                            'autocomplete'
                        ]);
                        
app.run(function($rootScope, auth, store, jwtHelper, $location) {
  auth.hookEvents();

  var refreshingToken = null;
  $rootScope.$on('$locationChangeStart', function() {
    var token = store.get('token');
    var refreshToken = store.get('refreshToken');
    if (token) {
      if (!jwtHelper.isTokenExpired(token)) {
        if (!auth.isAuthenticated) {
          auth.authenticate(store.get('profile'), token);
          //Store the status in the scope 
          $rootScope.isAuthenticated = auth.isAuthenticated
        }
      } else {
        if (refreshToken) {
          if (refreshingToken === null) {
            refreshingToken = auth.refreshIdToken(refreshToken).then(function(idToken) {
              store.set('token', idToken);
              auth.authenticate(store.get('profile'), idToken);
            }).finally(function() {
              refreshingToken = null;
            });
          }
          return refreshingToken;
        } else {
          $location.path('/');
        }
      }
    }
  });
});
                        
app.config(function($stateProvider, authProvider, $httpProvider,
  jwtInterceptorProvider, $urlRouterProvider, $locationProvider, filepickerProvider){
    
  authProvider.init({
    domain: 'cedricbongaerts.eu.auth0.com',
    clientID: 'JHBzxHogKvCHTOSmPtNr6EncjaSM1GDg',
    loginUrl: '/'
  });  
  
 $stateProvider

    .state('home', {
      url: '/',
      templateUrl: 'partials/home.html',
      controller: 'homeCtrl',
        data: {
            requiresLogin: false
        },
        resolve: {
          $title: function() { return 'Home'; }
        }
    })
    
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: 'partials/dashboard.html',
      controller: 'dashCtrl',
        data: {
            requiresLogin: true
        },
        resolve: {
          $title: function() { return 'Dashboard'; }
        }
    })

    .state('capture', {
      url: '/capture',
      templateUrl: 'partials/capture.html',
      controller: 'captureCtrl',
        data: {
            requiresLogin: true
        },
        resolve: {
          $title: function() { return 'Capture'; }
        }
    })
    
    .state('detail', {
      url: '/detail/{id}',
      templateUrl: 'partials/viewCapture.html',
      controller: 'viewCaptureCtrl',
      data: {
            requiresLogin: true
        },
      resolve: {
          $title: function() { return 'Detail'; }
				}
    })

    .state('profile', {
      url: '/profile',
      templateUrl: 'partials/profile.html',
      controller: 'profileCtrl',
        data: {
            requiresLogin: true
        },
        resolve: {
          $title: function() { return 'Profile'; }
        }
    });
    
    $urlRouterProvider.otherwise("/");
    filepickerProvider.setKey('A0KU8DpZ3Tai1uHSmwevwz');
    
  jwtInterceptorProvider.tokenGetter = function(store, jwtHelper, auth) {
    var idToken = store.get('token');
    var refreshToken = store.get('refreshToken');
    // If no token return null
    if (!idToken || !refreshToken) {
      return null;
    }
    // If token is expired, get a new one
    if (jwtHelper.isTokenExpired(idToken)) {
      return auth.refreshIdToken(refreshToken).then(function(idToken) {
        store.set('token', idToken);
        return idToken;
      });
    } else {
      return idToken;
    }
  };
  
  $httpProvider.interceptors.push('jwtInterceptor');
});

app.filter('startFrom', function() {
  return function(data, currentPage, pageSize) {
    return data.slice(((currentPage-1)*pageSize), ((currentPage)*pageSize));
  };
});