angular.module('ydb').directive('dashboard', function () {
    return {
        restrict: 'E',
        templateUrl: 'client/ydb/internal/dashboard/dashboard.html',
        controllerAs: 'dashboard',
        controller: function ($scope, $reactive, $state, availableGameModes, availableGameTypes) {

            $reactive(this).attach($scope);

            // Subscribe to all game changes
            this.subscribe("games");

            $scope.types = availableGameTypes;

            $scope.modes = availableGameModes;

            // The skeleton for new games
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
             * Stores data for the player who should be added to the game
             *
             * @type {{}}
             */
            this.newPlayer = {
                error: false
            };

            /**
             * The game id for the add player operations
             *
             * @type {undefined}
             */
            this.gameId = undefined;

            /**
             * Sets the game id to add players
             *
             * @param gameId
             */
            this.setGameId = (gameId) => {
                this.gameId = gameId;
            };

            /**
             * Checks the username for the new player
             */
            this.checkUserName = () => {
                Meteor.call(
                    'checkPassword',
                    this.newPlayer.userName,
                    Package.sha.SHA256(this.newPlayer.pin),
                    (err, res) => {
                        if (res) {
                            if (this.addPlayerToGame(this.gameId, res, Boolean(this.newPlayer.remote))) {
                                this.newPlayer = {};
                                this.setGameId(undefined);
                            }
                        } else {
                            this.newPlayer.error = true;
                        }
                        $scope.$apply();
                    }
                );
            };

            this.observeChanges = () => {
                let games = Games.find({
                    players: {
                        $elemMatch: {
                            _id: Meteor.userId()
                        }
                    }
                });
                let handle = games.observeChanges({
                    changed: (id, game) => {
                        if (game.running) {
                            $state.go('game', {
                                gameId: id
                            });
                            handle.stop();
                        }
                    }
                });
            };

            /**
             * Load the quick stats from the server
             */
            $scope.loadQuickStats = () => {
                Meteor.call(
                    'getQuickStats',
                    Meteor.userId(),
                    (err, res) => {
                        $scope.quickStats = res;
                        $scope.$apply();
                    }
                );
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
                        } else {
                            $('#addNewPlayerModal').modal('hide');
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
             * Start the game
             *
             * @param gameId
             */
            this.startGame = (gameId) => {
                Meteor.call(
                    'startGame',
                    gameId,
                    Meteor.userId()
                );
            };

            /**
             * Deletes a game
             *
             * @param gameId
             */
            this.deleteGame = (gameId) => {
                Meteor.call(
                    'deleteGame',
                    gameId,
                    Meteor.userId()
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
                game.players.forEach(function (player) {
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
                activeGames: () => {
                    return Games.find({finished: false});
                }
            });

            // Tell the controller to observe changes on joined games
            this.observeChanges();

            // Load quick stats
            $scope.loadQuickStats();
        }
    }
});