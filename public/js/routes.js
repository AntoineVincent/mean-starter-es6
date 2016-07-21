const routes = ($routeProvider, $httpProvider) => {

    $routeProvider
        .when('/', {
            templateUrl: 'views/contact.html',
            controller: 'contactController',
            controllerAs: 'vm'
        })
        .otherwise({
            redirectTo: '/'
        })

}
