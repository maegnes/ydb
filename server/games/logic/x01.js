/**
 * Main class for our X01 games logic
 *
 * @type {X01}
 */
X01 = class X01 {

    ERROR_THROWN_OVER = 'THROWN_OVER';

    get startingPoints() {
        return 0;
    }

    constructor(game) {
        this.game = game;
        this.checkoutCalculator = new CheckoutPath();
    }

    /**
     * Defines a no score score
     * @type {{score: number, fieldName: string, fieldType: string}}
     */
    noScore = {
        score: 0,
        fieldName: "No Score",
        fieldType: 'N'
    };

    /**
     * A new dart hit the board
     *
     * @param score
     */
    score = (score) => {
        this.game.currentRoundDartsThrown++;
        try {
            this.subtractFromPlayerScore(score);
            this.handleCheckoutPath();
            if (3 == this.game.currentRoundDartsThrown && this.game.running) {
                this.nextPlayer();
            }
        } catch(err) {
            switch (err) {
                case this.ERROR_THROWN_OVER:
                    this.setNoScore();
                    break;
            }
        }
    };

    handleCheckoutPath = () => {
        // Check a possible checkout
        if (this.getCurrentPlayerObject().scoreRemaining <= 170) {
            let remaining = (3 - (this.game.currentRoundDartsThrown));
            // If no more dart is remaining calculate it for the next round
            if (0 == remaining) {
                remaining = 3;
            }
            this.checkoutCalculator.calculate(this.getCurrentPlayerObject().scoreRemaining, remaining);
            if (this.checkoutCalculator.isCheckoutPossible()) {
                let paths = this.checkoutCalculator.getPaths();
                if (paths.ONE.length > 0) {
                    this.getCurrentPlayerObject().checkoutPath = paths.ONE[0];
                } else if (paths.TWO.length > 0) {
                    this.getCurrentPlayerObject().checkoutPath = paths.TWO[0];
                } else {
                    this.getCurrentPlayerObject().checkoutPath = paths.THREE[0];
                }
            } else {
                this.getCurrentPlayerObject().checkoutPath = undefined;
            }
        }
    };

    /**
     * Updates the three dart average for the current player
     */
    updateAverage = () => {
        let avgData = UserStats.getThreeDartsAverage(
            this.getCurrentPlayerObject().user._id,
            this.game._id
        );
        this.getCurrentPlayerObject().TDAVG = avgData.TDAVG;
    };

    /**
     * Subtracts the given score from the players remaining points
     *
     * @param score
     * @returns {boolean}
     */
    subtractFromPlayerScore = (score) => {

        // First, check if it would be negative, 0 or 1
        let player = this.getCurrentPlayerObject();
        let newScore = player.scoreRemaining - score.score;

        if (newScore >= 0) {

            // If the score is 0 check if he reached it with a double - otherwise throw thrown over error
            if ((1 == newScore) || (0 == newScore && 'D' != score.fieldType)) {
                throw this.ERROR_THROWN_OVER;
            }

            // Calculate remaining score
            player.scoreRemaining -= score.score;

            if (undefined === this.getCurrentPlayerScores()) {
                this.getCurrentPlayerObject().scores[this.game.currentSet] = [];
                this.getCurrentPlayerObject().scores[this.game.currentSet][this.game.currentLeg] = [];
            }

            // Add score to current score to show it to the other players
            this.game.currentScores.push(score);

            // Add the score to the personal scores
            this.getCurrentPlayerScores().push(score);

            if (0 == newScore) {
                // Player checked out! Start new leg!
                if (2 == player.legsWon) {
                    player.setsWon++;
                    // Check if the game is ower
                    if (player.setsWon == this.game.firstToSets) {
                        this.finish();
                    } else {
                        this.startNewSet();
                    }
                } else {
                    player.legsWon++;
                    this.startNewLeg();
                }
            }

        } else {
            throw this.ERROR_THROWN_OVER;
        }
        return true;
    };

    /**
     * Sets the no score scores if a player is over thrown
     */
    setNoScore = () => {

        // Replace the latest players scores with NO SCORE
        if (this.game.currentRoundDartsThrown > 1) {
            this.getCurrentPlayerScores().splice((this.game.currentRoundDartsThrown - 1) * -1);
        }

        // Push 3x no score to the players score
        this.getCurrentPlayerScores().push(this.noScore, this.noScore, this.noScore);

        // Fallback to the score before the user has over thrown
        let sum = 0;
        this.getCurrentPlayerScores().forEach(
            (score) => {
                sum += score.score;
            }
        );

        this.getCurrentPlayerObject().scoreRemaining = this.startingPoints - sum;

        // Okay, now jump to the next player
        this.nextPlayer();
    };

    /**
     * Jumps to the next player
     */
    nextPlayer = () => {

        this.handleCheckoutPath();

        this.updateAverage();

        let indexNextPlayer = 0;

        // Reset the current scores
        this.game.currentScores = [];

        // Reset the counter
        this.game.currentRoundDartsThrown = 0;

        this.setNextPlayer();
    };

    /**
     * Sets the current player to the next player in the players array
     */
    setNextPlayer = (index = -1) => {
        let newIndex = 0;
        if (-1 == index) {
            newIndex = this.game.currentPlayerIndex + 1;
        } else {
            newIndex = index + 1;
        }
        // Check the index of the next player
        if (this.game.players[newIndex] === undefined) {
            newIndex = 0;
        }
        this.game.currentPlayerIndex = newIndex;
        this.game.currentPlayer = this.game.players[newIndex]._id;
    };

    /**
     * Adds the given user as a new player for the game
     *
     * @param user - the meteor user object
     * @param remotePlayer - is the player a remote player?
     */
    addPlayer = (user, remotePlayer) => {
        let player = {
            _id: user._id,
            remote: remotePlayer,
            scores: [],
            user: user,
            scoreRemaining: this.startingPoints,
            legsWon: 0,
            setsWon: 0
        };
        this.game.players.push(player);
    };

    /**
     * Sets a random starting player and starts the game
     *
     * @returns {boolean}
     */
    start = () => {
        let startingPlayerIndex = Math.floor(Math.random() * this.game.players.length);
        this.game.running = true;
        this.game.currentPlayer = this.game.players[startingPlayerIndex]._id;
        this.game.currentPlayerIndex = startingPlayerIndex;
        this.game.currentScores = [];
        this.game.currentLegBeginner = startingPlayerIndex;
        this.game.currentSetBeginner = startingPlayerIndex;
        return true;
    };

    /**
     * Finishes a game
     */
    finish = () => {
        this.updateAverage();
        this.game.winner = this.game.currentPlayer;
        this.game.running = false;
        this.game.finished = true;
        this.game.currentScores = [];
        this.getCurrentPlayerObject().legsWon = 0;
        this.showMessage("Fabulous victory, " + this.getCurrentPlayerObject().user.username + "!", 8000);
    };

    /**
     * Starts a new leg
     */
    startNewLeg = () => {
        this.game.currentLeg++;
        this.game.currentRoundDartsThrown = 0;
        this.game.currentScores = [];
        this.setNextPlayer(this.game.currentLegBeginner);
        this.game.currentLegBeginner = this.game.currentPlayerIndex;
        // Reset all remaining scores to the starting points (501, 401, 301)
        this.resetRemainingScores();
        this.showMessage("Starting a new leg. Game on!", 3000);
    };

    /**
     *
     * @param message - the message
     * @param ms - how long shall the message be displayed?
     */
    showMessage = (message, ms) => {
        this.game.message = {
            msg: message,
            ms: ms
        };
    };

    /**
     * Starts a new set
     */
    startNewSet = () => {
        this.game.currentSet++;
        this.game.currentLeg = 0;
        this.game.currentRoundDartsThrown = 0;
        this.game.currentScores = [];
        this.setNextPlayer(this.game.currentLegBeginner);
        this.game.currentLegBeginner = this.game.currentPlayerIndex;
        this.game.currentSetBeginner = this.game.currentPlayerIndex;
        this.resetRemainingScores();
        this.resetLegsWon();
        this.showMessage("Starting a new set. Game on!", 3000);
    };

    /**
     * Resets the remaining points of all players to the starting points
     */
    resetRemainingScores = () => {
        this.game.players.forEach(
            (player) => {
                player.scoreRemaining = this.startingPoints;
                player.checkoutPath = undefined;
            }
        );
    };

    /**
     * Resets the won legs information after a set has been finished
     */
    resetLegsWon = () => {
        this.game.players.forEach(
            (player) => {
                player.legsWon = 0;
            }
        );
    };

    /**
     * Returns the current player object from the array
     *
     * @returns {*}
     */
    getCurrentPlayerObject = () => {
        return this.game.players[this.game.currentPlayerIndex];
    };

    /**
     * Returns the current scores from the current player and leg
     * @returns {*}
     */
    getCurrentPlayerScores = () => {
        if (undefined === this.game.players[this.game.currentPlayerIndex].scores[this.game.currentSet]) {
            this.game.players[this.game.currentPlayerIndex].scores[this.game.currentSet] = [];
        }
        if (undefined === this.game.players[this.game.currentPlayerIndex].scores[this.game.currentSet][this.game.currentLeg]) {
            this.game.players[this.game.currentPlayerIndex].scores[this.game.currentSet][this.game.currentLeg] = [];
        }
        return this.game.players[this.game.currentPlayerIndex].scores[this.game.currentSet][this.game.currentLeg];
    };

    /**
     * Check if the game is already started
     *
     * @returns {boolean}
     */
    isStarted = () => {
        return (this.game.running === true);
    };

    /**
     * Check if the game is finished
     *
     * @returns {boolean}
     */
    isFinished = () => {
        return (this.game.finished === true);
    };

    /**
     * During an active message the game is locked
     */
    isLocked = () => {
        return (this.game.message);
    };
};

/**
 * Class for the 501 game
 *
 * @type {X501}
 */
X501 = class X501 extends X01 {
    constructor(game) {
        super(game);
    }
    get startingPoints() {
        return 501;
    }
};

/**
 * Class for the 401 game
 *
 * @type {X401}
 */
X401 = class X401 extends X01 {
    constructor(game) {
        super(game);
    }
    get startingPoints() {
        return 401;
    }
};

/**
 * Class for the 301 game
 *
 * @type {X301}
 */
X301 = class X301 extends X01 {
    constructor(game) {
        super(game);
    }
    get startingPoints() {
        return 301;
    }
};

/**
 * Class for the 201 game
 *
 * @type {201}
 */
X201 = class X201 extends X01 {
    constructor(game) {
        super(game);
    }
    get startingPoints() {
        return 201;
    }
};