angular.module('ydb').directive('dartboard', function() {
    return {
        restrict: 'E',
        templateUrl: 'client/ydb/internal/game/dartboard/dartboard.html',
        controllerAs: 'dartboard',
        controller: function($scope, $reactive, $state, $stateParams) {

            $reactive(this).attach($scope);

        }
    }
});