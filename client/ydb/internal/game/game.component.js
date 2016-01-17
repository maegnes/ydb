angular.module('ydb').directive('game', function() {
    return {
        restrict: 'E',
        templateUrl: 'client/ydb/internal/game/game.html',
        controllerAs: 'game',
        controller: function($scope, $reactive, $state, $stateParams) {

            $reactive(this).attach($scope);

            // Subscribe our games to retrieve real time updates
            this.subscribe("games");

            /**
             * Stores the current game id from the url
             *
             * @type {*|undefined}
             */
            this.gameId = $stateParams.gameId;

            $scope.ourGame = undefined;

            /**
             * Listen for the throwEvent. Is being emitted by dartboard or keyboard tracker
             */
            $scope.$on("throwEvent", function (event, score) {
                $scope.throw(score);
            });

            /**
             * Pass the throw to the server
             *
             * @param scores
             */
            $scope.throw = (scores) => {
                Meteor.call(
                    'score',
                    this.gameId,
                    scores
                );
            };

            /**
             * Returns the current game object
             *
             * @returns {undefined|*}
             */
            $scope.getGame = () => {
                if ($scope.ourGame) {
                    return $scope.ourGame;
                }
            };

            /**
             * Returns the current player
             *
             * @returns {*}
             */
            $scope.getCurrentPlayer = () => {
                if ($scope.ourGame) {
                    return $scope.ourGame.players[$scope.ourGame.currentPlayerIndex];
                }
            };

            $scope.scoringLocked = () => {
                if ($scope.ourGame) {
                    return ($scope.ourGame.message || $scope.ourGame.finished);
                }
            };

            /**
             * Helpers
             */
            this.helpers({
                currentGame: () => {
                    let games = Games.find({_id:this.gameId});
                    if (games.count() > 0) {
                        let game = games.fetch()[0];
                        $scope.ourGame = game;
                        let handle = games.observeChanges({
                            changed: (id, game) => {
                                if (game.currentPlayer !== undefined) {
                                    $scope.$broadcast("playerHasChanged", game);
                                }
                                if (!game.finished) {
                                    handle.stop();
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