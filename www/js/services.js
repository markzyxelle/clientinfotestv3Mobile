angular.module('starter')
 
.service('AuthService', function($q, $http, $state, $ionicPopup) {
  var LOCAL_TOKEN_KEY = 'JWT_TOKEN';
  // var username = '';
 
  function loadUserCredentials() {
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if (token) {
      useCredentials(token);
    }
  }
 
  function storeUserCredentials(token) {
    window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
    // useCredentials(token, user);
  }
 
  // function useCredentials(token, user) {
  //   username = user;
 
  //   // Set the token as header for your requests!
  //   // $http.defaults.headers.common['X-Auth-Token'] = token;
  // }
 
  function destroyUserCredentials() {
    // username = '';
    // $http.defaults.headers.common['X-Auth-Token'] = undefined;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  }
 
  var login = function(name, pw) {
    return $q(function(resolve, reject) {
      // $http.get('http://localhost:8000/notApproved');
      $http.post('http://localhost:8000/authenticate', {"username" : name, "password" : pw})
      // $http.post('http://clientinfotest.herokuapp.com/authenticate', {"username" : name, "password" : pw})
        .then(function successCallback(response) {
          storeUserCredentials(response.data.token);
          $state.go('tabs.dashboard');
          resolve('Login success.');
        }, function errorCallback(response) {
          if(response.status == "403"){
            storeUserCredentials(response.data.token);
            $state.go('reset');
            var alertPopup = $ionicPopup.alert({
              title: 'User not yet approved!',
              template: 'Please reset password to access the resource.'
            });
            resolve('Login success.');
          }
          else reject('Login Failed.');
        });
      // storeUserCredentials("JWT Token from Server", "username from server");
      // if ((name == 'admin' && pw == '1') || (name == 'user' && pw == '1')) {
      //   // Make a request and receive your auth token from your server
      //   storeUserCredentials("JWT Token from Server");    //the JWT token should be stored, username from server
      //   resolve('Login success.');
      // } else {
      //   reject('Login Failed.');
      // }
    });
  };
 
  var logout = function() {
    destroyUserCredentials();
  };
 
  // var isAuthorized = function(authorizedRoles) {
  //   if (!angular.isArray(authorizedRoles)) {
  //     authorizedRoles = [authorizedRoles];
  //   }
  //   return (isAuthenticated && authorizedRoles.indexOf(role) !== -1);
  // };
 
  // loadUserCredentials();
 
  return {
    login: login,
    logout: logout
    // isAuthenticated: function() {return isAuthenticated;},
    // username: function() {return username;}
  };
})

// .service('InitService', function($q, $http) {
//   var dashboard = function() {
//     var username;
//     $http.get('http://localhost:8000/dashboard').then(function successCallback(response) {
//       console.log(response.data);
//       username = response.data;
//     }, function errorCallback(response) {
//       //put holder for error here ---------------------===================================----------------------------
//     });
//     return username;
//   };
 
//   return {
//     dashboard: dashboard,
//   };
// })

.service('ResetService', function($q, $http, $state, $ionicPopup) {
  var changePassword = function(password, confirmPassword) {
    return $q(function(resolve, reject) {
      // $http.get('http://localhost:8000/notApproved');
      $http.post('http://localhost:8000/changePassword', {"password" : password, "confirmPassword" : confirmPassword})
      // $http.post('http://clientinfotest.herokuapp.com/changePassword', {"password" : password, "confirmPassword" : confirmPassword})
        .then(function successCallback(response) {
          $state.go('tabs.dashboard');
          resolve('Changed Password Successfully.');
        }, function errorCallback(response) {
          reject('Changing of Password Failed.');
        });
      // storeUserCredentials("JWT Token from Server", "username from server");
      // if ((name == 'admin' && pw == '1') || (name == 'user' && pw == '1')) {
      //   // Make a request and receive your auth token from your server
      //   storeUserCredentials("JWT Token from Server");    //the JWT token should be stored, username from server
      //   resolve('Login success.');
      // } else {
      //   reject('Login Failed.');
      // }
    });
  };

  return {
    changePassword: changePassword
  };
})

.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function (response) {
      $rootScope.$broadcast({
        400: AUTH_EVENTS.notAuthenticated,
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notApproved
      }[response.status], response);
      return $q.reject(response);
    }
  };
})
 
.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
  $httpProvider.interceptors.push(['$q', '$location', function ($q, $location) {
    return {
      'request': function (config) {
        config.headers = config.headers || {};
        if (localStorage.getItem('JWT_TOKEN')) {
          config.headers.Authorization = 'Bearer ' + localStorage.getItem('JWT_TOKEN');
          config.headers.AJAX = 'AJAX from mobile';
        }
        return config;
      }
    };
  }])
});

// $httpProvider.interceptors.push(['$q', '$location', function ($q, $location) {
  //   return {
  //     'request': function (config) {
  //       config.headers = config.headers || {};
  //       // if ($localStorage.token) {
  //         // config.headers.Authorization = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjEsImlzcyI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwXC9hdXRoZW50aWNhdGUiLCJpYXQiOjE0Nzc2MzE3NTcsImV4cCI6MTQ3NzYzNTM1NywibmJmIjoxNDc3NjMxNzU3LCJqdGkiOiIxOWMwODU4ZmI5YTk4ZTE4MzlmZjYwMzYzZmQ0ZmM0YyJ9.XV4UiTSGjEZ5J07B-VB7StAQ_FDoEQ4zQ9Kv9qgaagU';
  //       // }
  //       return config;
  //     }
  //   };
  // }])