/**
 * Directive for a game
 */
angular.module('ydb').directive('game', function() {
    return {
        restrict: 'E',
        templateUrl: function(element, attributes) {
            var gameType = attributes.gtype;
            switch(gameType) {
                case 'cricket':
                    return 'client/ydb/internal/game/types/cricket/template.html';
                default:
                    return 'client/ydb/internal/game/types/x01/template.html';
            }
        },
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

            /**
             * Checks if the scoring is currently locked (after set/leg change for instance)
             * @returns {*|boolean}
             */
            $scope.scoringLocked = () => {
                if ($scope.ourGame) {
                    return ($scope.ourGame.message || $scope.ourGame.finished);
                }
            };

            /**
             * Evaluates if the score tracker (dartboard or keypad) is visible for the current user
             *
             * @returns {boolean}
             */
            $scope.isScoreTrackerVisible = () => {
                let game = $scope.ourGame;
                // Tracker is visible if user is the current user OR user is the owner and the current player is not a remote player
                return (game.currentPlayer == Meteor.userId()) || ((!game.players[game.currentPlayerIndex].remote) && (game.owner._id == Meteor.userId()));
            };

            $scope.convertAmountToString = (amount) => {
                if (amount >= 3) {
                    return 'drei';
                }
                if (2 == amount) {
                    return 'zwei';
                }
                if (1 == amount) {
                    return 'eins';
                }
                return 'nichts';
            };

            /**
             * Helpers
             */
            this.helpers({
                /**
                 * Returns the current game
                 * @returns {*}
                 */
                currentGame: () => {
                    let games = Games.find({_id:this.gameId});
                    if (games.count() > 0) {
                        let game = games.fetch()[0];
                        $scope.ourGame = game;
                        // Observe changes
                        let handle = games.observeChanges({
                            changed: (id, game) => {
                                // If the current player changed tell the dartboard to remove marked hits
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
                },
                /**
                 * Returns the current Meteor user
                 *
                 * @returns {any}
                 */
                user: () => {
                    return Meteor.user()
                }
            });
        }
    }
});