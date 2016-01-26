angular.module('ydb').directive('login', function () {
    return {
        restrict: 'E',
        templateUrl: 'client/ydb/login/login.html',
        controllerAs: 'login',
        controller: function ($scope, $reactive, $state) {

            /**
             * Model for the new user
             *
             * @type {{}}
             */
            this.user = {};

            /**
             * Error message for the template
             *
             * @type {null}
             */
            this.errorMessage = null;

            /**
             * Login user. if successful redirect to dashboard
             */
            this.login = () => {
                try {
                    Meteor.loginWithPassword(
                        this.user.username,
                        this.user.password,
                        (error) => {
                            if (error) {
                                this.errorMessage = 'The login was not successful!';
                                $scope.$apply();
                            } else {
                                $state.go('dashboard');
                            }
                        }
                    );
                } catch (error) {
                    this.errorMessage = 'The login was not successful!';
                }
            };
        }
    }
});