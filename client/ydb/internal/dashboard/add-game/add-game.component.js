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
                let convertData = {
                    visibility: Boolean(this.newGame.visibility),
                    monitor: Boolean(this.newGame.monitor),
                    owner: Meteor.user(),
                    practice: isPractice
                };
                let createGameData = Object.assign(this.newGame, convertData);
                Meteor.call(
                    'createGame',
                    createGameData,
                    (error, gameId) => {
                        if (error) {
                            // todo - error handling
                        } else {
                            this.addPlayerToGame(gameId, Meteor.userId(), false);
                            $('#startNewGameModal').modal('hide');
                            // If practice add computer player
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
                    (error, result) => {
                        if (error) {
                            console.log(error);
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
                    (error, result) => {
                        console.log(error, result);
                    }
                );
            };
        }
    }
});