/**
 * Directive for the settings modal
 */
angular.module('ydb').directive('addPractice', function() {
    return {
        restrict: 'E',
        templateUrl: 'client/ydb/internal/dashboard/add-practice/add-practice.html',
        controllerAs: 'addPractice',
        controller: function($scope, availableGameTypes, availableGameModes) {

            $scope.types = availableGameTypes;

            $scope.modes = availableGameModes;

            // @todo - add to server. no collection definitions in the client!
            this.newPractice = {
                visibility: true,
                created: new Date(),
                running: false,
                finished: false,
                players: [],
                monitor: false,
                currentPlayer: null,
                currentScores: [],
                currentRoundDartsThrown: 0,
                currentLeg: 0,
                currentSet: 0,
                firstToSets: 1,
                type: 501
            };

        }
    }
});