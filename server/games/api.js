/**
 * Provides server side API for games operations
 */
Meteor.methods({

    /**
     * Creates a new game based on the given data and returns the id of the created game
     *
     * @param data
     * @returns {*|any}
     */
    createGame: (data) => {
        // Static game data
        let staticGameData = {
            created: new Date(),
            running: false,
            finished: false,
            players: [],
            currentPlayer: null,
            currentScores: [],
            currentRoundDartsThrown: 0,
            currentLeg: 0,
            currentSet: 0,
            practice: false
        };

        // Merge client data with the static data
        let mergedData = Object.assign(staticGameData, data);

        // Insert game into mongodb
        return Games.insert(mergedData);
    },

    /**
     * Adds the given player to the given game
     *
     * @param gameId
     * @param playerId
     * @param remotePlayer
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

        if ("object" == typeof gameWrapper) {

            gameWrapper.addPlayer(user, remotePlayer);
            gameWrapper.save();

        } else {
            throw new Meteor.Error('Game ' + gameId + ' is unknown!');
        }
    },

    /**
     * Adds a computer opponent to the game
     *
     * @param gameId
     */
    addComputerOpponentToGame: (gameId) => {

        // Check if a computer opponent already exists in the database
        let computerOpponent = Meteor.users.findOne(
            {
                "profile.isComputer": true
            }
        );

        // If no computer opponent exists, create it
        if (undefined === computerOpponent) {
            // Create our computer opponent
            let createdOpponentId = Accounts.createUser({
                username: 'computer',
                password: '8888',
                profile: {
                    scoreTracking: 'keypad',
                    isComputer: true
                }
            });
            // Add computer opponent to the game
            if (createdOpponentId) {
                Meteor.call(
                    'addPlayerToGame',
                    gameId,
                    createdOpponentId,
                    true
                );
            } else {
                throw Meteor.Error('A computer opponent could not be added!');
            }
        } else {
            // Opponent already exists - add to game
            Meteor.call(
                'addPlayerToGame',
                gameId,
                computerOpponent._id,
                true
            );
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

        // Pulls the given player from the game
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

        // Observe the game to save stats after game is finished
        let query = Games.find({_id: gameId});

        // Add observers
        let handle = query.observeChanges({

            // If the game has been changed
            changed: (id, fields) => {
                // If the game is finished, export stats to stats collection
                if (fields.finished) {
                    let statExport = new StatsExport();
                    let game = Games.findOne(id);
                    statExport.extract(game);
                    handle.stop();
                }
                // Is the current player a computer opponent?
                if (fields.hasOwnProperty("currentPlayerIndex") || fields.hasOwnProperty("message")) {
                    // Find game
                    let gameData = Games.findOne(id);
                    // Create game wrapper for operations
                    let gameWrapper = GameFactory.createGame(gameData);
                    // Selects the current player
                    let currentPlayer = gameWrapper.getCurrentPlayerObject();
                    if (currentPlayer.user.profile.isComputer) {
                        // It's the computer opponents turn. If game is not locked, instruct the computer to play
                        if (!gameWrapper.isLocked()) {
                            // Create the computer opponent
                            let opponent = ComputerOpponentFactory.create(gameWrapper);

                            // Tells the opponent to throw the darts
                            opponent.nextDart();
                        }
                    }
                }
            },

            // If the game has been removed, stop the handler
            removed: (id) => {
                handle.stop();
            }
        });

        // Start the game and save state to database
        if (gameWrapper.start()) {
            gameWrapper.save();
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
        } else {
            throw new Meteor.Error("You are not allowed to delete the given game!");
        }
    },

    /**
     * Being called after every throw to the board
     *
     * @param gameId
     * @param score
     */
    score: (gameId, score) => {

        // Selects the game from the database
        let gameData = Games.findOne(gameId);

        // Create game wrapper
        let gameWrapper = GameFactory.createGame(gameData);

        // If the game is running and NOT locked, pass the throw to the games logic
        if (gameData.running && !gameWrapper.isLocked()) {
            gameWrapper.score(score);
        }
    }
});