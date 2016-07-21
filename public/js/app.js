angular.module('app', ['ngRoute'])
        .service('contactService', contactService)
        .controller('contactController', contactController)
        .config(routes)
        ;
