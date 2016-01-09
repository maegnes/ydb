angular.module('ydb').directive('dashboard', function() {
    return {
        restrict: 'E',
        templateUrl: 'client/ydb/internal/dashboard/dashboard.html',
        controllerAs: 'dashboard',
        controller: function($scope, $reactive, $state) {

            $reactive(this).attach($scope);

            // Subscribe to all game changes
            this.subscribe("games");

            // The skeleton for new games
            this.newGame = {
                owner: Meteor.user(),
                running: false,
                finished: false,
                players: []
            };

            /**
             * Informs the server to create a new game
             */
            this.createNewGame = () => {
                this.newGame.visibility = Boolean(this.newGame.visibility);
                Meteor.call(
                    'createGame',
                    this.newGame,
                    (error, gameId) => {
                        if (error) {
                            // todo - error handling
                        } else {
                            this.addPlayerToGame(gameId);
                        }

                    }
                );
            };

            /**
             * Adds the current user to the given game
             *
             * @param gameId - id of the game
             */
            this.addPlayerToGame = (gameId) => {
                Meteor.call(
                    'addPlayerToGame',
                    gameId,
                    Meteor.userId(),
                    (error, result) => {
                        if (error) {
                            // todo - errorhandling
                        }
                    }
                );
            };

            /**
             * Defines our controllers helpers
             */
            this.helpers({
                games: () => {
                    return Games.find({});
                }
            });
        }
    }
});