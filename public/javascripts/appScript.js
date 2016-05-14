var app = angular.module('AppModule', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('login', {
        url: '/login',
        templateUrl: './login.html',
        controller: 'AuthController'
    });
    $stateProvider.state('register',{
        url: '/register',
        templateUrl: './register.html',
        controller: 'AuthController'
    });
    $stateProvider.state('main',{
        url: '/main',
        templateUrl: './main.html',
        controller: 'AuthController'
    });
    $urlRouterProvider.otherwise('login');
}]);

app.factory('authService', ['$http', '$window', function ($http, $window) {
    var authService = {};
    authService.error = {};
    authService.setToken = function (token) {
        $window.localStorage['login-token'] = token;
        console.log("login_token "+ $window.localStorage['login-token']);
    };
    authService.getToken = function () {
        return $window.localStorage['login-token'];
    }
    authService.login = function (credentials) {
        return $http.post('/login', credentials).success(function (data) {
            authService.setToken(data.token);
        });
    };
    authService.register = function (credentials) {
        return $http.post('/register', credentials).success(function (data) {
            console.log(data);
            authService.setToken(data.token);
        });
    };
    authService.logout = function () {
        $window.localStorage.removeItem('login-token');
        console.log("login_token "+ $window.localStorage['login-token']);
    };
    authService.isLoggedIn = function () {
        var token = authService.getToken();
        if(token){
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            return payload.exp > Date.now()/1000;
        }
        else {
            return false
        }
    }
    return authService;
}]);

app.controller('AuthController', ['$scope', '$state', 'authService', function ($scope, $state, authService) {
    $scope.message = "";
    $scope.courseList = ['B.Tech','M.Tech', 'M.C.A.', 'B.C.A.', 'Ph.D'];
    $scope.branchList = ['CSE', 'EE', 'ECE', 'IT', 'CHE', 'CE', 'ME', 'BT','PROD'];
    $scope.batchList = [2012,2013,2014,2015,2016];
    $scope.login = function () {
        authService.login($scope.log).error(function (error) {
            $scope.message = error.message;
        }).then(function () {
            $state.go('main');
        });
        $scope.log = {};
    };
    $scope.register = function () {
        authService.register($scope.reg).error(function (error) {
            $scope.message = error.message;
        }).then(function () {
            $state.go('main');
        });
        $scope.reg = {};
    };
    $scope.logout = function () {
      authService.logout();
    };
    $scope.closeError = function () {
        $scope.message = "";
        authService.error.message = "";
    };
}]);