const checkIsConnected = ($q, $http, $rootScope, $location) => {
    let deferred = $q.defer()

    $http.get('/api/loggedin').success(() => {
        // Authenticated
        deferred.resolve()
    }).error(() => {
        // Not Authenticated
        deferred.reject()
        $location.url('/login')
    })

    return deferred.promise
}

const config = ($routeProvider, $httpProvider) => {
    'use strict';
    $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainController',
            controllerAs: 'vm',
            resolve: {
                connected: checkIsConnected
            }
        })
        .when('/login', {
            templateUrl: 'views/connect.html',
            controller: 'ConnectController',
            controllerAs: 'vm'
        })
        .when('/signup', {
            templateUrl: 'views/signup.html',
            controller: 'SignupController',
            controllerAs: 'vm'
        })
        .when('/admin', {
            templateUrl: 'views/admin.html',
            resolve: {
                connected: checkIsConnected
            }
        })
        .when('/about', {
            templateUrl: 'views/about.html'
        })
        .otherwise({
            redirectTo: '/'
        })

    $httpProvider.interceptors.push(($q, $location, $rootScope) => {
        return {
            request(config) {
                config.headers = config.headers || {};
                if ($rootScope.token)
                    config.headers.authorization = $rootScope.token
                return config
            },
            responseError(response) {
                if (response.status === 401 || response.status === 403)
                    $location.path('/login')
                return $q.reject(response)
            }
        }
    })
}

const run = ($rootScope, $location, ConnectService) => {
    // Watch path
    let path = () => {
        return $location.path()
    }
    $rootScope.$watch(path, (newVal, oldVal) => {
        $rootScope.activetab = newVal
    });

    // Logout
    $rootScope.logout = () => {
        $rootScope.token = null
        $rootScope.user = null
        ConnectService.disconnect().then(() => {
            $location.url('/login')
        })
    }
}

const checkPassword = () => {
    return {
        require: 'ngModel',
        link(scope, elem, attrs, ctrl) {
            var firstPassword = '#' + attrs.checkPassword;
            elem.add(firstPassword).on('keyup', () => {
                scope.$apply(() => {
                    let v = elem.val() === $(firstPassword).val();
                    ctrl.$setValidity('passwordMatch', v);
                })
            })
        }
    }
}

angular.module('app', ['ngRoute'])
    .config(config)
    .directive('checkPassword', checkPassword)
    .component('alert', alertComponent)
    .component('users', usersComponent)
    .component('user', userComponent)
    .controller('ConnectController', ConnectController)
    .controller('SignupController', SignupController)
    .controller('MainController', MainController)
    .service('ConnectService', ConnectService)
    .service('UserService', UserService)
    .run(run);
