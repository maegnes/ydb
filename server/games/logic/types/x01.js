/**
 * Main class for our X01 games logic
 *
 * @type {X01}
 */
X01 = class X01 {

    get startingPoints() {
        return 0;
    }

    constructor(game) {
        this.game = game;
    }

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
            scoreRemaining: this.startingPoints
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
        return true;
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