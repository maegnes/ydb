/**
 * Directive for a X01 game
 */
angular.module('ydb').directive('cricket', function() {
    return {
        restrict: 'E',
        templateUrl: 'client/ydb/internal/game/types/cricket/template.html',
        controllerAs: 'cricket',
        controller: function($scope, $reactive, $state, $stateParams) {
            // Nothing to do for the moment
        }
    }
});