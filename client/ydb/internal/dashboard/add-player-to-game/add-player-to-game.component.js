/**
 * Directive for the add player to game modal
 */
angular.module('ydb').directive('addPlayerToGame', function() {
    return {
        restrict: 'E',
        templateUrl: 'client/ydb/internal/dashboard/add-player-to-game/add-player-to-game.html',
        controllerAs: 'addPlayerToGame',
        controller: function($scope) {

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
                            alert('The player could not be added to the game');
                        } else {
                            $('#addNewPlayerModal').modal('hide');
                        }
                    }
                );
            };

        }
    }
});