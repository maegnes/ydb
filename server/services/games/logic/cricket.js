/**
 * Logic for a cricket game
 *
 * @type {Cricket}
 */
Cricket = class Cricket {

    constructor(gameData) {
        this.game = gameData;
        this.scores = new ScoresContainer();
    }

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
        };
        this.game.players.push(player);
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

    /**
     * Save the given game
     */
    save = () => {
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