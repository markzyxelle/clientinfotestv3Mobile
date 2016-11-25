// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })
  .state('reset', {
    url: '/reset',
    templateUrl: 'templates/reset.html',
    controller: 'ResetCtrl'
  })
  .state('tabs', {
    url: '/',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })
  .state('tabs.dashboard', {
    url: 'tabs/dashboard',
    views: {
      'dashboard-tab': {
        templateUrl: 'templates/dashboard.html',
        controller: 'DashboardCtrl'
      }
    }
  })
  .state('tabs.loans', {
    url: 'tabs/loans',
    views: {
      'loans-tab': {
        templateUrl: 'templates/loans.html',
        controller: 'LoansCtrl'
      }
    }
  })
  .state('tabs.savings', {
    url: 'tabs/savings',
    views: {
      'savings-tab': {
        templateUrl: 'templates/savings.html',
        controller: 'SavingsCtrl'
      }
    }
  });
  
  $urlRouterProvider.otherwise(function ($injector, $location) {
    var $state = $injector.get("$state");
    if(localStorage.getItem("JWT_TOKEN") === null) $state.go("login");
    else $state.go("tabs.dashboard");
  });
})

.config(['$ionicConfigProvider', function($ionicConfigProvider) {

    $ionicConfigProvider.tabs.position('bottom'); // other values: top

}])

.run(function ($rootScope, $state, AuthService, AUTH_EVENTS, $ionicPopup) {
  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState, fromParams) { 
    if (localStorage.getItem("JWT_TOKEN") === null) {
      if (next.name !== 'login') {
        var alertPopup = $ionicPopup.alert({
          title: 'Session Lost!',
          template: 'Sorry, You have to login again.'
        });
        event.preventDefault();
        $state.go('login');
      }
    }

    if(next.name === 'login'){
      if (localStorage.getItem("JWT_TOKEN") !== null){
        $state.go('tabs.dashboard');
      }
    }
  });
})