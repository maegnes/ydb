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