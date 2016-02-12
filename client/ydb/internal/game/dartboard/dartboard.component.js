/**
 * Directive for the canvas drawn dartboard. Used to track scores and accuracy calculation
 */
angular.module('ydb').directive('dartboard', function() {
    return {
        restrict: 'E',
        templateUrl: 'client/ydb/internal/game/dartboard/dartboard.html',
        controllerAs: 'dartboard',
        controller: function($scope, $reactive, $state, $stateParams, dartBoardCreator) {

            /**
             * Dartboard class
             */
            $scope.dartBoard = dartBoardCreator;

            /**
             * Set some dartboard configurations
             */
            $scope.drawBoard = () => {
                // DIV element which surrounds the canvas container
                $scope.dartBoard.htmlContainer = document.getElementById('db-container');
                // Canvas container
                $scope.dartBoard.canvasContainer = document.getElementById('dartboard-container');
                // Automatically adapt to the width of the container
                $scope.dartBoard.manualScale(document.getElementById('dartboard-width').offsetWidth - 2);
                // Init dartboard
                $scope.dartBoard.init();
                // Draws the dartboard as a canvas element
                $scope.dartBoard.draw();
            };

            /**
             * The callback is being called automatically from the dartBoard class after clicking on the board
             * @param amounts
             * @param thrownDarts
             * @param scores
             * @param lastScore
             * @param lastPosition
             */
            $scope.dartBoard.callback = (amounts, thrownDarts, scores, lastScore, lastPosition) => {
                // Broadcast a throwEvent
                $scope.$parent.$broadcast("throwEvent", lastScore);
                // Broadcast a positionEvent for the accuracy calculation
                $scope.$parent.$broadcast("positionEvent", lastPosition);
            };

            /**
             * watch for a player change. Being emitted by the game component
             */
            $scope.$on("playerHasChanged", () => {
                $scope.dartBoard.reset();
            });

            // Draw the dartboard!
            $scope.drawBoard();
        }
    }
});