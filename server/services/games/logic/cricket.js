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
    score = (score) => {
        this.getCurrentPlayerScores().push(score);
        this.save();
    };

    /**
     * Adds the given user as a new player for the game
     *
     * @param user - the meteor user object
     * @param isRemotePlayer - is the player a remote player?
     */
    addPlayer = (user, isRemotePlayer) => {
        let player = {
            _id: user._id,
            remote: isRemotePlayer,
            scores: [],
            user: user,
            legsWon: 0,
            setsWon: 0,
            dartsThrown: 0
        };
        this.game.players.push(player);
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
            this.game.players[this.game.currentPlayerIndex].scores[this.game.currentSet][this.game.currentLeg]['FIFTEEN'] = 0;
            this.game.players[this.game.currentPlayerIndex].scores[this.game.currentSet][this.game.currentLeg]['SIXTEEN'] = 0;
            this.game.players[this.game.currentPlayerIndex].scores[this.game.currentSet][this.game.currentLeg]['SEVENTEEN'] = 0;
            this.game.players[this.game.currentPlayerIndex].scores[this.game.currentSet][this.game.currentLeg]['EIGHTEEN'] = 0;
            this.game.players[this.game.currentPlayerIndex].scores[this.game.currentSet][this.game.currentLeg]['NINETEEN'] = 0;
            this.game.players[this.game.currentPlayerIndex].scores[this.game.currentSet][this.game.currentLeg]['TWENTY'] = 0;
            this.game.players[this.game.currentPlayerIndex].scores[this.game.currentSet][this.game.currentLeg]['BULL'] = 0;
        }
        return this.game.players[this.game.currentPlayerIndex].scores[this.game.currentSet][this.game.currentLeg];
    };

};