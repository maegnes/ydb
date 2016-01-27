/**
 * Directive for the settings modal
 */
angular.module('ydb').directive('addGame', function() {
    return {
        restrict: 'E',
        templateUrl: 'client/ydb/internal/dashboard/add-game/add-game.html',
        controllerAs: 'addGame',
        controller: function($scope, $reactive, $state, availableGameModes, availableGameTypes) {

            $scope.types = availableGameTypes;

            $scope.modes = availableGameModes;

            // @todo - add to server. no collection definitions in the client!
            this.newGame = {
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

            /**
             * Informs the server to create a new game
             */
            this.createNewGame = () => {
                this.newGame.visibility = Boolean(this.newGame.visibility);
                this.newGame.monitor = Boolean(this.newGame.monitor);
                this.newGame.owner = Meteor.user();
                Meteor.call(
                    'createGame',
                    this.newGame,
                    (error, gameId) => {
                        if (error) {
                            // todo - error handling
                        } else {
                            this.addPlayerToGame(gameId, Meteor.userId(), false);
                            $('#startNewGameModal').modal('hide');
                        }

                    }
                );
            };

            /**
             * Adds the current user to the given game
             *
             * @param gameId - id of the game
             * @param userId - id of the user
             * @param remotePlayer - is the player a remote player
             */
            this.addPlayerToGame = (gameId, userId, remotePlayer) => {
                Meteor.call(
                    'addPlayerToGame',
                    gameId,
                    userId,
                    remotePlayer,
                    (error, result) => {
                        if (error) {
                            console.log(error);
                        }
                    }
                );
            };

        }
    }
});