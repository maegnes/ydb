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
    addPlayerToGame: (gameId, playerId) => {

        let user = Meteor.users.findOne(playerId);
        let game = Games.findOne(gameId);

        if (!user) {
            throw new Meteor.Error("This user does not exist!");
        }

        if (!game) {
            throw new Meteor.Error("The game does not exist!")
        }

        if (game.started) {
            throw new Meteor.Error("This game is already started!");
        }

        if (game.finished) {
            throw new Meteor.Error("This game is already finished!");
        }

        // Create the player element
        let player = {
            _id: user._id,
            scores: [],
            user: user
        };

        // Update mongo database
        Games.update(
            {
                _id: game._id
            },
            {
                $addToSet: {
                    players: player
                }
            }
        );
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

        Games.update(
            {
                _id: gameId
            },
            {
                $set: {
                    running: true
                }
            }
        );

    },

    deleteGame: (gameId, userId) => {
        console.log(userId);
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