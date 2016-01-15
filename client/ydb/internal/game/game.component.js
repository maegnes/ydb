angular.module('ydb').directive('game', function() {
    return {
        restrict: 'E',
        templateUrl: 'client/ydb/internal/game/game.html',
        controllerAs: 'game',
        controller: function($scope, $reactive, $state, $stateParams) {

            $reactive(this).attach($scope);

            this.subscribe("games");

            this.gameId = $stateParams.gameId;

            $scope.$on("throwEvent", function (event, score) {
                $scope.throw(score);
            });

            $scope.throw = (scores) => {
                Meteor.call(
                    'score',
                    this.gameId,
                    scores
                );
            };

            $scope.init = () => {
            };

            this.helpers({
                currentGame: () => {
                    let games = Games.find({_id:this.gameId});
                    if (games.count() > 0) {
                        let game = games.fetch()[0];
                        let handle = games.observeChanges({
                            changed: (id, game) => {
                                if (game.currentPlayer !== undefined) {
                                    $scope.$broadcast("playerHasChanged", game);
                                }
                            }
                        });
                        return game;
                    }
                    return undefined;
                }
            });
        }
    }
});