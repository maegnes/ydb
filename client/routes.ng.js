// Routen setzen
angular.module('ydb').config(function ($urlRouterProvider, $stateProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    $stateProvider
        .state('index', {
            url: '/index',
            templateUrl: 'client/ydb/views/index.ng.html',
            controller: 'IndexCtrl'
        });

    $urlRouterProvider.otherwise('/index');

});