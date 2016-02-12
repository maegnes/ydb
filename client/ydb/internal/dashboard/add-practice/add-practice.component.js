/**
 * Directive for the add practice game modal
 */
angular.module('ydb').directive('addPractice', function() {
    return {
        restrict: 'E',
        templateUrl: 'client/ydb/internal/dashboard/add-practice/add-practice.html',
        controllerAs: 'addPractice',
        controller: function($scope, availableGameTypes, availableGameModes, availableDifficultyLevels) {
            /**
             * Different game types
             */
            $scope.types = availableGameTypes;

            /**
             * Different game modes
             */
            $scope.modes = availableGameModes;

            /**
             * Selected difficulty level for the practice
             */
            $scope.difficultyLevels = availableDifficultyLevels;
        }
    }
});