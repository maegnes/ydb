/**
 * Logic for a cricket game
 *
 * @type {Cricket}
 */
Cricket = class Cricket extends AbstractGame {

    constructor(gameData) {
        super(gameData);
        this.scores = new ScoresContainer();
    }

    /**
     * Tracks a user score
     *
     * @param score
     */
    score(score) {

        let player = this.getCurrentPlayerObject();

        if (score.field == 0 || (score.field >= 15 && score.field <= 25)) {

            this.game.currentRoundDartsThrown++;

            // Add score to current score to show it to the other players
            this.game.currentScores.push(score);

            // Get the score
            let field = score.field;
            let currentScore = this.getCurrentPlayerScores()[field];
            this.getCurrentPlayerScores()[field] = Math.min(3, (currentScore + score.multiplier));
        }

        let playerScore = this.getCurrentPlayerScores().reduce((a, b) => a + b, 0);

        if (21 == playerScore) {
            // Start new leg!
            if (2 == player.legsWon) {
                player.setsWon++;
                // Check if the game is over
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
        if (3 == this.game.currentRoundDartsThrown) {
            this.nextPlayer();
        }
        this.save();
    };

    /**
     * Jumps to the next player
     */
    nextPlayer() {

        this.game.currentRoundDartsThrown = 0;

        // Reset the current scores
        this.game.currentScores = [];

        this.setNextPlayer();
    };

    /**
     * Adds the given user as a new player for the game
     *
     * @param user - the meteor user object
     * @param isRemotePlayer - is the player a remote player?
     */
    addPlayer(user, isRemotePlayer) {
        let player = {
            _id: user._id,
            remote: isRemotePlayer,
            scores: this.getScoreSkeleton(),
            user: user,
            legsWon: 0,
            setsWon: 0,
            dartsThrown: 0
        };
        this.game.players.push(player);
    };

    /**
     * Starts a new leg
     */
    startNewLeg() {
        this.game.currentLeg++;
        this.game.currentRoundDartsThrown = 0;
        this.game.currentScores = [];
        this.setNextPlayer(this.game.currentLegBeginner);
        this.game.currentLegBeginner = this.game.currentPlayerIndex;
        this.resetPlayerScores();
        this.showMessage("Starting a new leg. Game on!", 3000);
    };

    /**
     * Starts a new set
     */
    startNewSet() {
        this.game.currentSet++;
        this.game.currentLeg = 0;
        this.game.currentRoundDartsThrown = 0;
        this.game.currentScores = [];
        this.setNextPlayer(this.game.currentLegBeginner);
        this.game.currentLegBeginner = this.game.currentPlayerIndex;
        this.game.currentSetBeginner = this.game.currentPlayerIndex;

        // Reset leg related information and show information message
        this.resetPlayerScores();
        this.resetLegsWon();
        this.showMessage("Starting a new set. Game on!", 3000);
    };

    /**
     * Resets the player scores
     */
    resetPlayerScores() {
        this.game.players.forEach(
            (player) => {
                player.scores = this.getScoreSkeleton();
            }
        );
    };

    /**
     * Returns the score structure for cricket games
     *
     * @returns {Array}
     */
    getScoreSkeleton() {
        scoreSkeleton = [];
        scoreSkeleton[15] = 0;
        scoreSkeleton[16] = 0;
        scoreSkeleton[17] = 0;
        scoreSkeleton[18] = 0;
        scoreSkeleton[19] = 0;
        scoreSkeleton[20] = 0;
        scoreSkeleton[25] = 0;
        return scoreSkeleton;
    };

    /**
     * Returns the current scores from the current player and leg
     * @returns {*}
     */
    getCurrentPlayerScores() {
        return this.game.players[this.game.currentPlayerIndex].scores;
    };

};