angular.module('ydb').directive('game', function() {
    return {
        restrict: 'E',
        templateUrl: 'client/ydb/internal/game/game.html',
        controllerAs: 'game',
        controller: function($scope, $reactive, $state) {

            $reactive(this).attach($scope);

        }
    }
});