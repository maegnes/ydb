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
                created: new Date(),
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
             * Removes the current player from the given game
             *
             * @param gameId
             */
            this.removePlayerFromGame = (gameId) => {
                Meteor.call(
                    'removePlayerFromGame',
                    gameId,
                    Meteor.userId(),
                    (error, result) => {
                        console.log(error, result);
                    }
                );
            };

            /**
             * Checks if the player has already joined the given game
             *
             * @param gameId
             * @returns {boolean}
             */
            this.hasPlayerJoinedGame = (gameId) => {
                let game = Games.findOne(gameId);
                let joinedGame = false;
                game.players.forEach(function(player) {
                    if (player._id == Meteor.userId()) {
                        joinedGame = true;
                    }
                });
                return joinedGame;
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