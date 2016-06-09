/**
 * Parent class for all game types
 *
 * @type {AbstractGame}
 */
AbstractGame = class AbstractGame {

    constructor(gameData) {
        this.game = gameData;
    }

    /**
     * Check if the game is already started
     *
     * @returns {boolean}
     */
    isStarted() {
        return (this.game.running === true);
    };

    /**
     * Check if the game is finished
     *
     * @returns {boolean}
     */
    isFinished() {
        return (this.game.finished === true);
    };

    /**
     * During an active message the game is locked
     */
    isLocked() {
        return (this.game.message);
    };

    /**
     * Returns the current player object from the array
     *
     * @returns {*}
     */
    getCurrentPlayerObject() {
        return this.game.players[this.game.currentPlayerIndex];
    };

    /**
     * Sets the current player to the next player in the players array
     */
    setNextPlayer(index = -1) {
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
     *
     * @param message - the message
     * @param ms - how long shall the message be displayed?
     */
    showMessage(message, ms) {
        this.game.message = {
            msg: message,
            ms: ms
        };
    };

    /**
     * Sets a random starting player and starts the game
     *
     * @returns {boolean}
     */
    start() {
        // Select a random starting player
        let startingPlayerIndex = Math.floor(Math.random() * this.game.players.length);
        // Set game related information
        this.game.running = true;
        this.game.currentPlayer = this.game.players[startingPlayerIndex]._id;
        this.game.currentPlayerIndex = startingPlayerIndex;
        this.game.currentLegBeginner = startingPlayerIndex;
        this.game.currentSetBeginner = startingPlayerIndex;
        this.game.currentScores = [];
        return true;
    };

    /**
     * Finishes a game
     */
    finish() {
        this.game.winner = this.game.currentPlayer;
        this.game.running = false;
        this.game.finished = true;
        this.game.currentScores = [];
        this.getCurrentPlayerObject().legsWon = 0;
        this.showMessage("Fabulous victory, " + this.getCurrentPlayerObject().user.username + "!", 8000);
    };

    /**
     * Save the given game
     */
    save() {
        Games.update(
            {
                _id: this.game._id
            },
            this.game
        );
        if (this.game.message) {
            Meteor.setTimeout(
                () => {
                    this.game.message = undefined;
                    this.save();
                },
                this.game.message.ms
            );
        }
    };

};