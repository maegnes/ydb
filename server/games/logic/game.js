/**
 * Server side game logic for the X01 games
 */
Meteor.methods({

    /**
     * Logic for X01 games
     *
     * @param gameId - the id of the game
     * @param scores - the thrown scores by the current player
     * @returns {*|any}
     */
    X01throw: (gameId, scores) => {

        let game = Games.findOne(gameId);
        let indexCurrentPlayer = 0;

        // Update to current scores to show them to the other players
        game.currentScores.push(scores);

        game.players.forEach(function(player, index) {
            if (player._id == game.currentPlayer) {
                indexCurrentPlayer = index;
                player.scores.push(scores);
                player.scoreRemaining -= scores.score;
            }
        });

        Games.update(
            {
                _id: gameId
            },
            game
        );

        // If user has thrown 3 darts, remove current scores
        if (3 == game.currentScores.length) {
            let indexNextPlayer = 0;
            game.currentScores = [];
            // Set the new currentPlayer
            if (game.players[indexCurrentPlayer + 1] === undefined) {
                indexNextPlayer = 0;
            } else {
                indexNextPlayer = indexCurrentPlayer + 1;
            }
            game.currentPlayer = game.players[indexNextPlayer]._id;

            Meteor.setTimeout(

                () => {
                    Games.update(
                        {
                            _id: gameId
                        },
                        game
                    );
                },
                2000
            );
        }
    }
});