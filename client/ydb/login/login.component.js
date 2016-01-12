angular.module('ydb').directive('login', function () {
    return {
        restrict: 'E',
        templateUrl: 'client/ydb/login/login.html',
        controllerAs: 'login',
        controller: function ($scope, $reactive, $state) {

            $reactive(this).attach($scope);

            this.user = {};

            this.errorMessage = null;

            this.login = () => {
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
            };
        }
    }
});