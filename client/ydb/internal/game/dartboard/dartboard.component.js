angular.module('ydb').directive('dartboard', function() {
    return {
        restrict: 'E',
        templateUrl: 'client/ydb/internal/game/dartboard/dartboard.html',
        controllerAs: 'dartboard',
        controller: function($scope, $reactive, $state, $stateParams, dartBoardCreator) {

            $reactive(this).attach($scope);

            $scope.dartBoard = dartBoardCreator;

            $scope.dartBoard.htmlContainer = document.getElementById('db-container');
            $scope.dartBoard.canvasContainer = document.getElementById('dartboard-container');
            $scope.dartBoard.manualScale(document.getElementById('dartboard-width').offsetWidth - 2);
            $scope.dartBoard.init();
            $scope.dartBoard.draw();

            $scope.dartBoard.callback = (amounts, thrownDarts, scores, lastScore) => {
                $scope.$broadcast("throwEvent", lastScore);
            };

            $scope.$on("playerHasChanged", (res, dasd) => {
                $scope.dartBoard.reset();
            });
        }
    }
});