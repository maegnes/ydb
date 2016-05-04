/**
 * Directive for a X01 game
 */
angular.module('ydb').directive('x01', function() {
    return {
        restrict: 'E',
        templateUrl: 'client/ydb/internal/game/types/x01/template.html',
        controllerAs: 'x01',
        controller: function($scope, $reactive, $state, $stateParams) {
            // Nothing to do for the moment
        }
    }
});