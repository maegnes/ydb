angular.module('ydb').config(function ($urlRouterProvider, $stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $stateProvider
        .state('start', {
            url: '/index',
            template: '<start></start>'
        })
        .state('registerPage', {
            url: '/register',
            template: '<register></register>'
        });

    $urlRouterProvider.otherwise("/index");
});