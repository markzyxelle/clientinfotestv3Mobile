angular.module('starter')
 
.controller('AppCtrl', function($scope, $state, $ionicPopup, $ionicHistory, $location, $timeout, AuthService, AUTH_EVENTS) {
  // $scope.username = AuthService.username();
 
  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event, fromState) {
    if(fromState.data.error != "invalid_credentials"){
      AuthService.logout();
      $state.go('login');
      var alertPopup = $ionicPopup.alert({
        title: 'Session Lost!',
        template: 'Sorry, You have to login again.'
      });
    }
  });

  $scope.$on(AUTH_EVENTS.notApproved, function(event, fromState) {
    if(fromState.data.error != "user_not_approved"){
      $state.go('reset');
      var alertPopup = $ionicPopup.alert({
        title: 'User not yet approved!',
        template: 'Please reset password to access the resource.'
      });
    }
  });
 
  // $scope.setCurrentUsername = function(name) {
  //   $scope.username = name;
  // };

  $scope.logout = function() {
    AuthService.logout();
    $location.path('/login')
      $timeout(function () {
          $ionicHistory.clearCache();
          $ionicHistory.clearHistory();
          // $log.debug('clearing cache')
      },300)
    // $state.go('login');
  };
})

.controller('LoginCtrl', function($scope, $state, $ionicPopup, AuthService) {
  $scope.data = {};
 
  $scope.login = function(data) {
    AuthService.login(data.username, data.password).then(function(authenticated) {
      // $state.go('tabs.dashboard', {}, {reload: true});
      // $scope.setCurrentUsername(data.username);
      // $scope.setCurrentUsername(AuthService.username());
      
    }, function(err) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please check your credentials!'
      });
    });
  };
})

.controller('DashboardCtrl', function($scope, $state, $http, $ionicPopup) {
  // $scope.$on('$ionicView.beforeEnter', function() {
    $scope.welcomeMessage = "Welcome to the App! Please wait for your details to load.";
    //clientinfotest.herokuapp.com
    // $http.get('http://localhost:8000/dashboard').then(function successCallback(response) {
    $http.get('http://clientinfotest.herokuapp.com/dashboard').then(function successCallback(response) {
      $scope.welcomeMessage = "Hello " + response.data + "!";
    }, function errorCallback(response) {
      //put holder for error here ---------------------===================================----------------------------
    });
  // })
})

.controller('LoansCtrl', function($scope, $state, $http, $ionicPopup) {
  // $scope.$on('$ionicView.beforeEnter', function() {
    // $http.get('http://localhost:8000/loans').then(function successCallback(response) {
    $http.get('http://clientinfotest.herokuapp.com/loans').then(function successCallback(response) {
      $scope.loans = response.data;
    }, function errorCallback(response) {
      //put holder for error here ---------------------===================================----------------------------
    });
    // $scope.logout = function() {
    //   AuthService.logout();
    //   $state.go('login');
    // };
  // })
})

.controller('SavingsCtrl', function($scope, $state, $http, $ionicPopup) {
  // $scope.logout = function() {
  //   AuthService.logout();
  //   $state.go('login');
  // };
})

.controller('ResetCtrl', function($scope, $state, $http, $ionicPopup, ResetService) {
  $scope.changePassword = function(data) {
    if(data.password != data.confirmPassword){
      var alertPopup = $ionicPopup.alert({
          title: 'Changing of Password Failed',
          template: 'Passwords do not match.'
        });
    }else{
      ResetService.changePassword(data.password, data.confirmPassword).then(function() {
      // $state.go('tabs.dashboard', {}, {reload: true});
      // $scope.setCurrentUsername(data.username);
      // $scope.setCurrentUsername(AuthService.username());
      
      }, function(err) {
        var alertPopup = $ionicPopup.alert({
          title: 'Changing of Password Failed',
          template: 'Please try again.'
        });
      });
    }
  };
});