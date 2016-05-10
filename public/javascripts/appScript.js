var app = angular.module('AppModule',['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider,$urlRouterProvider) {
    $stateProvider.state('login',{
        url:'/login',
        templateUrl:'./login.html',
        controller:'AuthController'
    });
    $urlRouterProvider.otherwise('login');
}]);

app.controller('AuthController',['$scope', 'authService', function ($scope, authService) {
    $scope.login = function () {
        console.log('login clicked');
        console.log($scope.username+" "+$scope.password);
        authService.login({username: $scope.username, password: $scope.password});
    }
}]);
app.factory('authService',['$http', '$window', function ($http,$window) {
    var authService = {};
    authService.setToken = function (token) {
        $window.localStorage['login-token'] = token;
    }
    authService.login = function (credentials) {
        $http.post('/login', credentials).success(function (data) {
            authService.setToken(data.token);
            console.log(data.token);
        });
    }
    return authService;
}]);