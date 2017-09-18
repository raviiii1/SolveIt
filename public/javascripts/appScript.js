var app = angular.module('AppModule', ['ui.router']);

app.filter('examFilter', function () {
    return function (exams, query) {
        if(query === undefined) {
            return exams;
        }

        var filtered = [];

        if(query.name !== "" && query.name !== undefined){
            console.log(query.name);
            angular.forEach(exams, function (exam) {
                if (exam.name.toLowerCase().search(query.name.toLowerCase()) >=0 ) {
                    filtered.push(exam);
                }
            });
            exams = Array.from(filtered);
            filtered = [];
        }

        if(query.subject !== "" && query.subject !== undefined) {
            console.log(query.subject);
            angular.forEach(exams, function (exam) {
                if (exam.subject.toLowerCase().search(query.subject.toLowerCase()) >= 0) {
                    filtered.push(exam);
                }
            });
            exams = Array.from(filtered);
            filtered = [];
        }

        if(query.venue !== "" && query.venue !== undefined) {
            console.log(query.venue);
            angular.forEach(exams, function (exam) {
                if (exam.venue.toLowerCase().search(query.venue.toLowerCase()) >= 0) {
                    filtered.push(exam);
                }
            });
            exams = Array.from(filtered);
            filtered = [];
        }

        if(query.date !== "" && query.date !== undefined) {
            console.log(query.date);
            angular.forEach(exams, function (exam) {
                if (exam.date.toLowerCase().search(query.date.toLowerCase()) >=0 ) {
                    filtered.push(exam);
                }
            });
            exams = Array.from(filtered);
            filtered = [];
        }

        if(query.timeDuration !== "" && query.timeDuration !== undefined) {
            console.log(query.timeDuration);
            angular.forEach(exams, function (exam) {
                if ((exam.time + "/" + exam.duration).toLowerCase().search(query.timeDuration.toLowerCase()) >= 0) {
                    filtered.push(exam);
                }
            });
            exams = Array.from(filtered);
            filtered = [];
        }

        if(query.supervisor !== "" && query.supervisor !== undefined) {
            console.log(query.supervisor);
            angular.forEach(exams, function (exam) {
                if (exam.supervisor.toLowerCase().search(query.supervisor.toLowerCase()) >= 0) {
                    filtered.push(exam);
                }
            });
            exams = Array.from(filtered);
            filtered = [];
        }

        return exams;
    }
});

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'AuthController',
        onEnter: ['$state', 'authService', function($state, authService){
            if(authService.isLoggedIn()){
                $state.go('main');
            }
        }]
    });
    $stateProvider.state('register',{
        url: '/register',
        templateUrl: 'views/register.html',
        controller: 'AuthController',
        onEnter: ['$state', 'authService',   function($state, authService){
            if(authService.isLoggedIn()){
                $state.go('main');
            }
        }]
    });
    $stateProvider.state('main',{
        url: '/main',
        templateUrl: 'views/main.html',
        controller: 'MainController',
        onEnter: ['$state', 'authService', function($state, authService){
            if(!authService.isLoggedIn()){
                $state.go('login');
            }
        }]
    });
    $stateProvider.state('main.notice',{
        url: '/notice',
        templateUrl: 'views/notice.html',
        controller: 'MainController',
        onEnter: ['$state', 'authService', function($state, authService){
            if(!authService.isLoggedIn()){
                $state.go('login');
            }
        }]
    });
    $stateProvider.state('main.exams',{
        url: '/exams',
        templateUrl: 'views/exams.html',
        controller: 'ExamController',
        onEnter: ['$state', 'authService', function($state, authService){
            if(!authService.isLoggedIn()){
                $state.go('login');
            }
        }]
    });
    $stateProvider.state('main.createExams',{
        url: '/createExams',
        templateUrl: 'views/newExam.html',
        controller: 'MainController',
        onEnter: ['$state', 'authService', function($state, authService){
            if(!authService.isLoggedIn()){
                $state.go('login');
            }
        }]
    });
    $urlRouterProvider.otherwise('login');
}]);

app.factory('authService',['$http', '$window', '$state', function ($http, $window, $state) {
    var authService = {};
    authService.error = {};
    authService.setAdmin = function(isAdmin){
        $window.localStorage['login-admin'] = isAdmin;
        console.log("login-admin "+ $window.localStorage['login-admin']);
    };
    authService.setToken = function (token) {
        $window.localStorage['login-token'] = token;
        console.log("login_token "+ $window.localStorage['login-token']);
    };
    authService.getToken = function () {
        return $window.localStorage['login-token'];
    };
    authService.getAdmin = function () {
        return $window.localStorage['login-admin'];
        console.log("admin logged");
    };
    authService.login = function (credentials) {
        return $http.post('/login', credentials).success(function (data) {
            authService.setToken(data.token);
            authService.setAdmin(data.isAdmin);
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
        $window.localStorage.removeItem('login-admin');
        $state.go('login');
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

app.factory('mainService',['$http', function ($http) {
    var mainService = {};
    return mainService;
}]);

app.factory('examService',['$http', function ($http) {
    var examService = {};
    var allExams = [
        {
            name:'Automata CT1',
            date:'11/06/2016',
            time:'9:00am',
            subject:'CSE-101',
            venue:'CCF2',
            duration:'3 hrs',
            supervisor:'Ranvijay Singh',
            code:'CS15AUTO01'
        },{
            name:'Automata CT2',
            date:'11/06/2016',
            time:'12:00noon',
            subject:'CSE-101',
            venue:'CCF2',
            duration:'3 hrs',
            supervisor:'Ranvijay Singh',
            code:'CS15AUTO02'
        },{
            name:'Computer Graphics CT1',
            date:'11/06/2016',
            time:'1:00pm',
            subject:'CSE-103',
            venue:'CCF1',
            duration:'3 hrs',
            supervisor:'Neeraj Tyagi',
            code:'CS15AUTO03'
        },{
            name:'Networking CT1',
            date:'11/06/2016',
            time:'2:00pm',
            subject:'CSE-106',
            venue:'CCF2',
            duration:'2 hrs',
            supervisor:'Neeraj Tyagi',
            code:'CS15AUTO04'
        },{
            name:'Shell Programming CT1',
            date:'11/06/2016',
            time:'2:00pm',
            subject:'CSE-105',
            venue:'CCF2',
            duration:'2 hrs',
            supervisor:'Divya Kumar',
            code:'CS15AUTO05'
        },{
            name:'Algorithms CT1',
            date:'11/06/2016',
            time:'2:00pm',
            subject:'CSE-102',
            venue:'CCF2',
            duration:'2 hrs',
            supervisor:'Divya Kumar',
            code:'CS15AUTO06'
        },{
            name:'Algorithms CT1',
            date:'11/06/2016',
            time:'2:00pm',
            subject:'CSE-102',
            venue:'CCF2',
            duration:'2 hrs',
            supervisor:'Divya Kumar',
            code:'CS15AUTO07'
        },{
            name:'Automata CT1',
            date:'11/06/2016',
            time:'2:00pm',
            subject:'CSE-101',
            venue:'CCF2',
            duration:'2 hrs',
            supervisor:'Ranvijay Singh',
            code:'CS15AUTO08'
        },{
            name:'Automata CT1',
            date:'11/06/2016',
            time:'2:00pm',
            subject:'CSE-101',
            venue:'CCF2',
            duration:'2 hrs',
            supervisor:'Ranvijay Singh',
            code:'CS15AUTO09'
        }
    ];
    examService.getExams = function () {
        return allExams;
    }

    examService.addNewExam = function (exam) {
        exam.general.code = (function(str){
            var hash = 0;
            if (str.length == 0) return hash;
            for (var i = 0; i < str.length; i++) {
                var char = str.charCodeAt(i);
                hash = ((hash<<5)-hash)+char;
                hash = hash & hash; // Convert to 32bit integer
            }
            return hash;
        })((exam.general.startDate+exam.general.subject+exam.general.venue).toString());
        allExams.push(exam.general);
        /*return $http.post('/createExam',exam).success(function () {
            console.log(data);
        });*/
    }
    return examService;
}]);

app.controller('AuthController',['$scope', '$state', 'authService', function ($scope, $state, authService) {
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
    $scope.closeError = function () {
        $scope.message = "";
        authService.error.message = "";
    };
}]);

app.controller('MainController',['$scope', 'authService', 'mainService', function ($scope, authService, mainService) {
    $scope.logout = function () {
        authService.logout();
    };
    $scope.isAdmin = authService.getAdmin();
}]);

app.controller('ExamController',['$scope', 'authService', 'examService', function ($scope, authService, examService) {
    $scope.scopeForDirective = {};
    $scope.selectExam = function (code) {
        console.log(code);
    };
    $scope.exams = examService.getExams();
    $scope.addNewExam = function (returnsObject) {
        if(returnsObject.exam) {
            examService.addNewExam(returnsObject.exam);
            /*
             examService.addNewExam(returnsObject.exam).error(function (error) {
             $scope.message = error.message;
             }).then(function () {
             });*/
        }
    };
    $scope.scopeForDirective.getNumberArray = function(num){
        return new Array(num);
    };
    $scope.initNewExamModal = function () {
        $scope.results={};
        $scope.modalTitle = "New Exam";
        $scope.modalSource = "views/newExam.html";
        $scope.modalTabs = [
            {'tabName': 'General', 'tabId': 'generalTab'},
            {'tabName': 'Details', 'tabId': 'detailsTab'}
        ];
        $scope.modalCustomScope =  $scope.scopeForDirective;
    };
    $scope.newExamModal = function ($event) {
        $scope.initNewExamModal();
        document.getElementById("create_exam_modal").style.display = "block";
        document.getElementById("id_modal").style.display = "block";
    };
}]);

app.directive("myModal",[function(){
    return {
        restrict : 'AE',
        templateUrl : 'views/modal.html',
        scope : {
            source : "@",
            title : "@",
            tabs : "=",
            submit : "&",
            customScope : "="
        },
        controller : ['$scope', 'examService', function ($scope, examService) {
            $scope.returns = {};
            $scope.tabs = {};
            $scope.next = function () {
                var index = -1;
                for(index = 0; index < $scope.tabs.length;index++){
                    if($scope.tabs[index].tabId == $scope.currentActiveTab){
                        if(index < $scope.tabs.length-1)
                            index++;
                        break;
                    }
                }
                $scope.switchTabs($scope.tabs[index].tabId);
            }
            $scope.previous = function () {
                var index = $scope.tabs.length;
                for(index = $scope.tabs.length-1; index >= 0;index--){
                    if($scope.tabs[index].tabId == $scope.currentActiveTab){
                        if(index > 0)
                            index--;
                        break;
                    }
                }
                $scope.switchTabs($scope.tabs[index].tabId);
            };
            $scope.switchTabs = function (tabId) {
                if(tabId === undefined){
                    tabId = $scope.tabs[0].tabId;
                }
                if($scope.currentActiveTab !== tabId) {
                    document.getElementById($scope.currentActiveTab).style.display = "none";
                    document.getElementById("tab_" + $scope.currentActiveTab).className = "my-modal-tab";
                    $scope.currentActiveTab = tabId;
                    document.getElementById(tabId).style.display = "block";
                    document.getElementById("tab_" + tabId).className = "my-modal-tab-hover";
                }
                $scope.saveWithoutClose();
            };
            $scope.save = function(){
                $scope.saveWithoutClose();
                $scope.returns = {}; // its mandatory to reset 'returns', otherwise the previous exam gets modified too. See more about - Call By Sharing.
                $scope.close();
            };
            $scope.saveWithoutClose = function(){
                $scope.submit({returnsObject : $scope.returns}); // Its mandatory to map the argument ($scope.returns) as an object ({returnsObject : ...}), in order to pass it to outer $scope.
            };
        }],
        link : function (scope, element, attrs) {
            scope.close = function(){
                element.css({'display':'none'});
                scope.currentActiveTab = 'generalTab';
            };
            scope.$watchCollection("tabs", function( newValue, oldValue ) {// waiting for tabs to be populated, so that currentActiveTab can be initialized.
                //if modal is 'tabbed' and currentActiveTab is undefined, yet.
                if(scope.tabs.length >1 && !scope.currentActiveTab) {
                    scope.currentActiveTab = scope.tabs[0].tabId;
                }
            });
        }
    }
}]);
