angular.module('ydb').directive('register', () => {
    return {
        restrict: 'E',
        templateUrl: 'client/ydb/register/register.html',
        controllerAs: 'register',
        controller: function($scope, $reactive, $state) {

            this.errorMessage = undefined;

            /**
             * Model for the new user
             *
             * @type {{}}
             */
            this.newUser = {};

            /**
             * Create user account
             */
            this.addUser = () => {
                try {
                    Accounts.createUser({
                        username: this.newUser.username,
                        password: this.newUser.password,
                        profile: {
                            scoreTracking: 'keyboard'
                        }
                    }, (error) => {
                        if (error) {
                            this.errorMessage = "The registration was not successful. Please check your input.";
                            $scope.$apply();
                        } else {
                            $state.go('dashboard');
                        }
                    });
                    this.newUser = {};
                } catch(error) {
                    this.errorMessage = "The registration was not successful. Please check your input.";
                }
            }
        }
    }
});