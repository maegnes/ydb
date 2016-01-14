/**
 * Server side game logic
 */
Meteor.methods({

    /**
     * Creates a new game based on the given data and returns the id of the created game
     *
     * @param data
     * @returns {*|any}
     */
    createGame: (data) => {
        return Games.insert(data);
    },

    /**
     * Adds the given player to the given game
     *
     * @param gameId
     * @param playerId
     */
    addPlayerToGame: (gameId, playerId, remotePlayer) => {

        let user = Meteor.users.findOne(playerId);
        let game = Games.findOne(gameId);

        let gameWrapper = GameFactory.createGame(game);

        if (!user) {
            throw new Meteor.Error("This user does not exist!");
        }

        if (!game) {
            throw new Meteor.Error("The game does not exist!")
        }

        if (gameWrapper.isStarted()) {
            throw new Meteor.Error("This game is already started!");
        }

        if (gameWrapper.isFinished()) {
            throw new Meteor.Error("This game is already finished!");
        }

        if ("object" == typeof testGame) {

            gameWrapper.addPlayer(user, remotePlayer);

            // Update mongo database
            Games.update(
                {
                    _id: game._id
                },
                testGame.game
            );
        } else {
            throw new Meteor.Error('Game ' + gameId + ' is unknown!');
        }
    },

    /**
     * Removes the given player from the given game
     *
     * @param gameId
     * @param playerId
     */
    removePlayerFromGame: (gameId, playerId) => {

        let game = Games.findOne(gameId);

        if (!game) {
            throw new Meteor.Error("The game does not exist!")
        }

        if (game.started) {
            throw new Meteor.Error("This game is already started!");
        }

        if (game.finished) {
            throw new Meteor.Error("This game is already finished!");
        }

        Games.update(
            {
                _id: gameId
            },
            {
                $pull: {
                    players: {
                        _id: playerId
                    }
                }
            }
        );

    },

    /**
     * Starts the given game
     *
     * @param gameId
     * @param userId
     */
    startGame: (gameId, userId) => {

        let game = Games.findOne(gameId);
        let gameWrapper = GameFactory.createGame(game);

        if (gameWrapper.start()) {
            Games.update(
                {
                    _id: gameId
                },
                gameWrapper.game
            );
        }
    },

    /**
     * Deletes the given game
     *
     * @param gameId
     * @param userId
     */
    deleteGame: (gameId, userId) => {
        let game = Games.findOne({
            _id: gameId,
            "owner._id": {
                $eq: userId
            }
        });
        if (game) {
            Games.remove(gameId);
        }
    }
});