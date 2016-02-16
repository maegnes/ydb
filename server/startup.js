/**
 * Handles automatic operations on running games (computer opponent and stat export)
 */
Meteor.startup(() => {

    // Defines the query for our live observation
    let runningGames = Games.find({
        running: true,
        finished: false
    });

    /**
     * Helper function to handle the computer opponents throwing
     * @param gameId
     * @param fields
     */
    let handleComputerOpponent = (gameId, fields) => {

        if (fields.hasOwnProperty("running") || fields.hasOwnProperty("currentPlayerIndex") || fields.hasOwnProperty("message")) {

            // Find game
            let gameData = Games.findOne(gameId);

            // Create game wrapper for operations
            let gameWrapper = GameFactory.createGame(gameData);

            // Selects the current player
            let currentPlayer = gameWrapper.getCurrentPlayerObject();

            // Check if it is the computer opponents turn
            if (currentPlayer.user.profile.isComputer) {

                // It is! If game is not locked, instruct the computer to play
                if (!gameWrapper.isLocked()) {

                    // Create the computer opponent
                    let opponent = ComputerOpponentFactory.create(gameWrapper);

                    // Tells the opponent to throw the darts
                    opponent.nextDart();
                }
            }
        }
    };

    // Add observers
    let handle = runningGames.observeChanges({

        // Is being called if a game enters the live query (e.g. a new game)
        added: (id, fields) => {
            handleComputerOpponent(id, fields);
        },

        // Is being called if a game changed (e.g. player change)
        changed: (id, fields) => {
            handleComputerOpponent(id, fields);
        },

        // Is being called after a game is finished and "leaves" to live query result
        removed: (id) => {
            let game = Games.findOne(id);
            if (game.finished) {
                let statExport = new StatsExport();
                statExport.extract(game);
            }
        }
    });

});