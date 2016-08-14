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
                            'ui.bootstrap.collapse',
                            'angular-filepicker',
                            'autocomplete',
                            'infinite-scroll',
                            'angularMoment',
                            'ngBootbox',
                            'ngScrollbars',
                            '720kb.socialshare',
                            'angular-loading-bar',
                            'angular-notification-icons',
                            'ngMap',
                            'ngSanitize',
                            'ng-uploadcare'
                        ]);
                        
app.config(function($stateProvider, authProvider, $httpProvider,
  jwtInterceptorProvider, $urlRouterProvider, $locationProvider, filepickerProvider, ScrollBarsProvider){
    
  $urlRouterProvider.otherwise("/");
 
 $stateProvider
 
    .state('home', {
      url: '/',
      templateUrl: 'partials/home.html',
      controller: 'homeCtrl',
        data: {
          pageTitle: 'Birdspotter',
          hidenavbar: true
        }
    })
    
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: 'partials/dashboard.html',
      controller: 'dashboardCtrl',
        data: {
            requiresLogin: true,
            pageTitle: 'Dashboard | Birdspotter'
        }
    })
    
    .state('following', {
      url: '/following',
      templateUrl: 'partials/following.html',
      controller: 'followingCtrl',
        data: {
            requiresLogin: true,
            pageTitle: 'Following | Birdspotter'
        }
    })

    .state('capture', {
      url: '/capture',
      templateUrl: 'partials/capture.html',
      controller: 'captureCtrl',
        data: {
            requiresLogin: true,
            pageTitle: 'Capture | Birdspotter'
        }
    })
    
      .state('detail', {
        url: '/detail/{id}',
        templateUrl: 'partials/viewCapture.html',
        controller: 'viewCaptureCtrl',
        data: {
              requiresLogin: true,
              pageTitle: 'Capture detail | Birdspotter'
          }
      })
      
      .state('edit', {
        url: '/detail/{id}/edit',
        templateUrl: 'partials/editCapture.html',
        controller: 'editCaptureCtrl',
        data: {
              requiresLogin: true,
              pageTitle: 'Edit Capture | Birdspotter'
          }
      })
    
      .state('user-profile', {
        url: '/user-profile/{id}',
        templateUrl: 'partials/viewUser.html',
        controller: 'viewUserCtrl',
          data: {
              requiresLogin: true,
              pageTitle: 'User Profile | Birdspotter'
          }
      })
      
      .state('user-captures', {
        url: '/user-profile/{id}/captures',
        templateUrl: 'partials/viewUserCaptures.html',
        controller: 'viewUserCtrl',
          data: {
              requiresLogin: true,
              pageTitle: 'User Captures | Birdspotter'
          }
      })
      
      .state('notifications', {
      url: '/notifications',
      templateUrl: 'partials/notifications.html',
      controller: 'notificationsCtrl',
        data: {
            requiresLogin: true,
            pageTitle: 'Notifications | Birdspotter'
        }
    })
    
    .state('users', {
        url: '/users',
        templateUrl: 'partials/users.html',
        controller: 'usersCtrl',
        data: {
          requiresLogin: true,
            pageTitle: 'Users | Birdspotter'
        }
      })
      
    .state('birdlist', {
        url: '/birdlist',
        templateUrl: 'partials/birdlist.html',
        controller: 'birdlistCtrl',
        data: {
          requiresLogin: true,
            pageTitle: 'Birds | Birdspotter'
        },
        params: {
          bird: 'Unknown' //default parameter
        }
      })
      
      .state('error', {
        url: '/error',
        templateUrl: 'partials/error.html',
        controller: 'errorCtrl',
          data: {
            pageTitle: 'Error | Birdspotter'
          }
      });
      
      authProvider.init({
        domain: 'cedricbongaerts.eu.auth0.com',
        clientID: 'JHBzxHogKvCHTOSmPtNr6EncjaSM1GDg',
        loginState: 'home'
      }); 
      
    filepickerProvider.setKey('AhTgLagciQByzXpFGRI0Az');
    
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
  
  ScrollBarsProvider.defaults = {
        scrollButtons: {
            scrollAmount: 'auto', // scroll amount when button pressed
            enable: true // enable scrolling buttons by default
        },
        scrollInertia: 400, // adjust however you want
        axis: 'y', // enable 2 axis scrollbars by default,
        theme: 'dark-3',
        setHeight: 350
    };
    
});

app.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = true;
    cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
  }]);

app.run([ '$rootScope', '$state', '$stateParams', 'auth', 'store', 'jwtHelper', '$location', function($rootScope, $state, $stateParams, auth, store, jwtHelper, $location) {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
  
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
          $rootScope.isAuthenticated = auth.isAuthenticated;
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
  
  $rootScope.$on('$viewContentLoaded', function(){ window.scrollTo(0, 0); });
}]);

app.filter('startFrom', function() {
  return function(data, currentPage, pageSize) {
    return data.slice(((currentPage-1)*pageSize), ((currentPage)*pageSize));
  };
});