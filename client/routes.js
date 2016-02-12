/**
 * User already logged in?
 *
 * @param $q
 * @returns {*}
 */
checkAlreadyLoggedIn = ($q) => {
    if (Meteor.userId() != null) {
        return $q.reject('ALREADY_AUTHENTICATED')
    } else {
        return $q.resolve();
    }
};

/**
 * User logged in?
 *
 * @param $q
 * @returns {*}
 */
checkLogin = ($q) => {
    if (Meteor.userId()) {
        return $q.resolve();
    } else {
        return $q.reject('NOT_LOGGED_IN');
    }
};

/**
 * Module configuration
 */
angular.module('ydb')
    .config(function ($urlRouterProvider, $stateProvider, $locationProvider) {

        // Set HTML5 mode
        $locationProvider.html5Mode(true);

        // Define application routes

        $stateProvider
            // Login - no active session needed
            .state('login', {
                url: '/login',
                template: '<login></login>',
                resolve: {
                    checkAlreadyLoggedIn
                }
            })
            // Login - no active session needed
            .state('logout', {
                url: '/logout',
                controller: ($state) => {
                    Meteor.logout(
                        () => {
                            $state.go('start');
                        }
                    );
                }
            })
            // Start page
            .state('start', {
                url: '/index',
                template: '<start></start>',
                resolve: {
                    checkAlreadyLoggedIn
                }
            })
            // Registration
            .state('registerPage', {
                url: '/register',
                template: '<register></register>',
                resolve: {
                    checkAlreadyLoggedIn
                }
            })
            // Dashboard - user must be logged in
            .state('dashboard', {
                url: '/dashboard',
                template: '<dashboard></dashboard>',
                resolve: {
                    checkLogin
                }
            })
            // Game detail - user must be logged in
            .state('game', {
                url: '/game/:gameId',
                template: '<game id="gameContainer"></game>',
                resolve: {
                    checkLogin
                }
            })
            // Stats - user must be logged in
            .state('stats', {
                url: '/stats',
                template: '<stats></stats>',
                resolve: {
                    checkLogin
                }
            })
            // Accuracy calculation - user must be logged in
            .state('accuracy', {
                url: '/accuracy',
                template: '<accuracy></accuracy>',
                resolve: {
                    checkLogin
                }
            });

        // Also define a fallback route
        $urlRouterProvider.otherwise("/index");
    })
    // Catch errors and redirect and handle redirects
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