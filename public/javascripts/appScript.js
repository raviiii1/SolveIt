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
    $urlRouterProvider.otherwise('login');
}]);

app.factory('authService', ['$http', '$window', function ($http, $window) {
    var authService = {};
    authService.error = {};
    authService.setToken = function (token) {
        $window.localStorage['login-token'] = token;
        console.log("login_token "+ $window.localStorage['login-token']);
    };
    authService.login = function (credentials) {
        $http.post('/login', credentials).success(function (data) {
            authService.setToken(data.token);
        }).error(function (error) {
            authService.error = error;
        });
    };
    authService.register = function (credentials) {
        $http.post('/register', credentials).success(function (data) {
            console.log(data);
            authService.setToken(data.token);
        }).error(function (error) {
            authService.error = error;
        });
    };
    authService.logout = function () {
        $window.localStorage.removeItem('login-token');
        console.log("login_token "+ $window.localStorage['login-token']);
    };
    return authService;
}]);

app.controller('AuthController', ['$scope', 'authService', function ($scope, authService) {
    $scope.message = "";
    $scope.courseList = ['B.Tech','M.Tech', 'M.C.A.', 'B.C.A.', 'Ph.D'];
    $scope.branchList = ['CSE', 'EE', 'ECE', 'IT', 'CHE', 'CE', 'ME', 'BT','PROD'];
    $scope.batchList = [2012,2013,2014,2015,2016];
    $scope.login = function () {
        authService.login($scope.log);
        $scope.log = {};
    };
    $scope.register = function () {
        authService.register($scope.reg);
        $scope.reg = {};
    };
    $scope.logout = function () {
      authService.logout();
    };
    $scope.closeError = function () {
        $scope.message = "";
        authService.error.message = "";
    }
    $scope.$watch(function () {
        return authService.error
    }, function (newVal, oldVal) {
        if (newVal !== 'undefined') {
            $scope.message = authService.error.message;
        }
    });
}]);