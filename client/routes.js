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
        return $q.reject('NOT_LOGGED_IN');
    }
};

angular.module('ydb')
    .config(function ($urlRouterProvider, $stateProvider, $locationProvider) {

        $locationProvider.html5Mode(true);

        $stateProvider
            .state('start', {
                url: '/index',
                template: '<start></start>',
                resolve: {
                    checkAlreadyLoggedIn
                }
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
            .state('game', {
                url: '/game/:gameId',
                template: '<game id="gameContainer"></game>',
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
                controller: ($state) => {
                    Meteor.logout(
                        () => {
                            $state.go('start');
                        }
                    );
                }
            });

        $urlRouterProvider.otherwise("/index");
    })
    .run(function ($rootScope, $state) {
        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            switch (error) {
                case 'ALREADY_AUTHENTICATED':
                    $state.go('dashboard');
                    break;
                case 'NOT_LOGGED_IN':
                    $state.go('login');
                    break;
                default:
                    $state.go('start');
            }
        });
    });