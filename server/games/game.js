// Store the server side games logic here
Meteor.methods({

    // Creates the game with the given data and returns the created game id
    createGame: (data) => {
        return Games.insert(data);
    },

    // Adds a player to a game
    addPlayerToGame: (gameId, playerId) => {

        let user = Meteor.users.findOne(playerId);
        let game = Games.findOne(gameId);

        if (!game) {
            throw new Meteor.Error("The game does not exist!")
        }

        if (game.started) {
            throw new Meteor.Error("This game is already started!");
        }

        let player = {
            _id: user._id,
            scores: []
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

    }
});