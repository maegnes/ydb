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
                    if (this.newUser.pin != this.newUser.pinConfirm) {
                        throw 'pin';
                    }
                    Accounts.createUser({
                        username: this.newUser.username,
                        password: this.newUser.pin,
                        profile: {
                            scoreTracking: 'keypad',
                            isComputer: false
                        }
                    }, (error) => {
                        if (error) {
                            this.errorMessage = "An error has occured. Please check your input.";
                            $scope.$apply();
                        } else {
                            $state.go('dashboard');
                        }
                    });
                    this.newUser = {};
                } catch(error) {
                    if ('pin' == error) {
                        this.errorMessage = 'PINs does not match!';
                    } else {
                        this.errorMessage = "An error has occured. Please check your input.";
                    }
                }
            }
        }
    }
});