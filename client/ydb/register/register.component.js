angular.module('ydb').directive('register', function() {
    return {
        restrict: 'E',
        templateUrl: 'client/ydb/register/register.html',
        controllerAs: 'register',
        controller: function($scope, $reactive, $state) {
            $reactive(this).attach($scope);

            this.newUser = {};

            this.addUser = () => {
                Accounts.createUser({
                    username: this.newUser.username,
                    password: this.newUser.password
                }, (error) => {
                    if (error) {
                        alert("Error occured");
                    } else {
                        $state.go('dashboard');
                    }
                }
                );
                this.newUser = {};
            }
        }
    }
});