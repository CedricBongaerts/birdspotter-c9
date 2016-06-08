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
                            'angularGrid',
                            'angular-loading-bar',
                            'angular-notification-icons',
                        ]);
                        
app.config(function($stateProvider, authProvider, $httpProvider,
  jwtInterceptorProvider, $urlRouterProvider, $locationProvider, filepickerProvider, ScrollBarsProvider){
    
  $urlRouterProvider.otherwise("/");
 
 $stateProvider
 
    .state('home', {
      url: '/',
      templateUrl: 'partials/home.html',
      controller: 'homeCtrl',
        resolve: {
          $title: function() { return 'Home'; }
        }
    })
    
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: 'partials/dashboard.html',
      controller: 'dashboardCtrl',
        data: {
            requiresLogin: true,
        },
        resolve: {
          $title: function() { return 'Dashboard'; }
        }
    })
    
    .state('following', {
      url: '/following',
      templateUrl: 'partials/following.html',
      controller: 'followingCtrl',
        data: {
            requiresLogin: true,
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
            requiresLogin: true,
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
              requiresLogin: true,
          },
        resolve: {
            $title: function() { return 'View Capture'; }
  				}
      })
      
      .state('edit', {
        url: '/detail/{id}/edit',
        templateUrl: 'partials/editCapture.html',
        controller: 'editCaptureCtrl',
        data: {
              requiresLogin: true,
          },
        resolve: {
            $title: function() { return 'Edit Capture'; }
  				}
      })
    
      .state('user-profile', {
        url: '/user-profile/{id}',
        templateUrl: 'partials/viewUser.html',
        controller: 'viewUserCtrl',
          data: {
              requiresLogin: true,
          },
          resolve: {
            $title: function() { return 'View Profile'; }
          }
      })
      
      .state('notifications', {
      url: '/notifications',
      templateUrl: 'partials/notifications.html',
      controller: 'notificationsCtrl',
        data: {
            requiresLogin: true,
        },
        resolve: {
          $title: function() { return 'Notifications'; }
        }
    })
    
    .state('users', {
        url: '/users',
        templateUrl: 'partials/users.html',
        controller: 'usersCtrl',
        data: {
          requiresLogin: true
        },
          resolve: {
            $title: function() { return 'Users List'; }
          }
      })
      
      .state('error', {
        url: '/error',
        templateUrl: 'views/error.html',
        controller: 'errorCtrl',
          resolve: {
            $title: function() { return '404'; }
          }
      });
      
      authProvider.init({
        domain: 'cedricbongaerts.eu.auth0.com',
        clientID: 'JHBzxHogKvCHTOSmPtNr6EncjaSM1GDg',
        loginState: 'home'
      }); 
      
    filepickerProvider.setKey('AIcUH5ju1R1SRGJRVC2TRz');
    
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
});

app.filter('startFrom', function() {
  return function(data, currentPage, pageSize) {
    return data.slice(((currentPage-1)*pageSize), ((currentPage)*pageSize));
  };
});

app.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(event.which === 13) {
                    scope.$apply(function(){
                            scope.$eval(attrs.ngEnter);
                    });
                    
                    event.preventDefault();
            }
        });
    };
});