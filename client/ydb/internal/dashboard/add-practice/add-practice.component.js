/**
 * Directive for the add practice game modal
 */
angular.module('ydb').directive('addPractice', function() {
    return {
        restrict: 'E',
        templateUrl: 'client/ydb/internal/dashboard/add-practice/add-practice.html',
        controllerAs: 'addPractice',
        controller: function($scope, availableGameTypes, availableGameModes, difficultyLevels) {
            // Just provide game types and modes to the template.
            $scope.types = availableGameTypes;
            $scope.modes = availableGameModes;
            $scope.difficultyLevels = difficultyLevels;
        }
    }
});