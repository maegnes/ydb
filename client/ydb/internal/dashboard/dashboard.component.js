angular.module('ydb').directive('dashboard', function() {
    return {
        restrict: 'E',
        templateUrl: 'client/ydb/internal/dashboard/dashboard.html',
        controllerAs: 'dashboard',
        controller: function($scope, $reactive, $state) {

            $reactive(this).attach($scope);

            this.subscribe("games");

            this.newGame = {
                owner: Meteor.user(),
                running: false,
                finished: false,
                players: []
            };

            this.createNewGame = () => {
                this.newGame.visibility = Boolean(this.newGame.visibility);
                Meteor.call(
                    'createGame',
                    this.newGame,
                    (error, gameId) => {
                        if (error) {
                            // todo - error handling

                        } else {
                            // Add the owner to the game
                            Meteor.call(
                                'addPlayerToGame',
                                gameId,
                                Meteor.userId(),
                                (error, result) => {
                                    console.log(error, result);
                                }
                            );
                        }

                    }
                );
            };

            this.addPlayerToGame = (gameId) => {
                Meteor.call(
                    'addPlayerToGame',
                    gameId,
                    Meteor.userId(),
                    (error, result) => {
                        console.log(error, result);
                    }
                );
            };

            this.helpers({
                games: () => {
                    return Games.find({});
                }
            });
        }
    }
});