angular.module('ydb').directive('accuracy', function() {
    return {
        restrict: 'E',
        templateUrl: 'client/ydb/internal/accuracy/accuracy.html',
        controllerAs: 'accuracy',
        controller: function($scope, $reactive, $state, $stateParams) {

            //$reactive(this).attach($scope);

        }
    }
});