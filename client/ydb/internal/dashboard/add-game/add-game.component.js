/**
 * Directive for the add game modal
 */
angular.module('ydb').directive('addGame', function() {
    return {
        restrict: 'E',
        templateUrl: 'client/ydb/internal/dashboard/add-game/add-game.html',
        controllerAs: 'addGame',
        controller: function($scope, $reactive, $state, availableGameModes, availableGameTypes) {

            /**
             * Available game types (501, 401 etc)
             */
            $scope.types = availableGameTypes;

            /**
             * Available game modes (first to x sets)
             */
            $scope.modes = availableGameModes;

            /**
             * Static data for a new game
             *
             * @type {{visibility: boolean, monitor: boolean, firstToSets: number, type: number, difficulty: number}}
             */
            this.newGame = {
                visibility: true,
                monitor: false,
                firstToSets: 1,
                type: 501,
                difficulty: 1
            };

            /**
             * Informs the server to create a new game
             */
            this.createNewGame = (isPractice = false) => {

                // Converts the form data
                let convertData = {
                    visibility: Boolean(this.newGame.visibility),
                    monitor: Boolean(this.newGame.monitor),
                    owner: Meteor.user(),
                    practice: isPractice
                };

                // Merge dynamic with the static data
                let createGameData = Object.assign(this.newGame, convertData);

                // Tell the server to create a new game
                Meteor.call(
                    'createGame',
                    createGameData,
                    (error, gameId) => {
                        if (error) {
                            alert('The game could not be created. Please try it again!');
                        } else {
                            // Adds the creator of the game as a player
                            this.addPlayerToGame(gameId, Meteor.userId(), false);

                            // Hide the add game modal
                            $('#startNewGameModal').modal('hide');

                            // If the game is a practice game, add computer player
                            if (isPractice) {
                                this.addComputerOpponentToGame(gameId);
                                $('#startNewPracticeModal').modal('hide');
                            }
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
                    (error) => {
                        if (error) {
                            alert('The player ' + userId + ' could not be added to game ' + gameId);
                        }
                    }
                );
            };

            /**
             * Adds a computer opponent to the given game
             *
             * @param gameId
             */
            this.addComputerOpponentToGame = (gameId) => {
                Meteor.call(
                    'addComputerOpponentToGame',
                    gameId,
                    (error) => {
                        if (error) {
                            alert('The computer opponent could not be added to the game.');
                        }
                    }
                );
            };
        }
    }
});