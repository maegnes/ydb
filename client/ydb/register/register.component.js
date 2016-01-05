angular.module('ydb').directive('register', function() {
    return {
        restrict: 'E',
        templateUrl: 'client/ydb/register/register.html',
        controllerAs: 'registerController',
        controller: function($scope, $reactive) {
            $reactive(this).attach($scope);

            this.addUser = () => {
                alert("HALLO!");
            }
        }
    }
});