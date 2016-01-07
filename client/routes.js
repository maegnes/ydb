// Method to check if a user is already authenticated
checkAlreadyLoggedIn = ($q) => {
    if (Meteor.userId() != null) {
        return $q.reject('ALREADY_AUTHENTICATED')
    } else {
        return $q.resolve();
    }
};

checkLogin = ($q) => {
    if (Meteor.userId()) {
        return $q.resolve();
    } else {
        return $q.restrict();
    }
};

angular.module('ydb')
    .config(function ($urlRouterProvider, $stateProvider, $locationProvider) {

        $locationProvider.html5Mode(true);

        $stateProvider
            .state('start', {
                url: '/index',
                template: '<start></start>'
            })
            .state('registerPage', {
                url: '/register',
                template: '<register></register>',
                resolve: {
                    checkAlreadyLoggedIn
                }
            })
            .state('dashboard', {
                url: '/dashboard',
                template: '<dashboard></dashboard>',
                resolve: {
                    checkLogin
                }
            })
            .state('login', {
                url: '/login',
                template: '<login></login>',
                resolve: {
                    checkAlreadyLoggedIn
                }
            })
            .state('logout', {
                url: '/logout',
                controller: () => {
                    Meteor.logout();
                }
            });

        $urlRouterProvider.otherwise("/index");
    })
    .run(function ($rootScope, $state) {
        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            if (error === 'ALREADY_AUTHENTICATED') {
                $state.go('start');
            }
        });
    });