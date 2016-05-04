/**
 * Factory class to create our game objects based on the given type
 *
 * @type {GameFactory}
 */
GameFactory = class GameFactory {

    /**
     * Creates a game object based on the given type
     *
     * @param game
     */
    static createGame(game) {
        switch (game.type) {
            case 501:
                return new X501(game);
                break;
            case 401:
                return new X401(game);
                break;
            case 301:
                return new X301(game);
                break;
            case 201:
                return new X201(game);
                break;
            case "cricket":
                return new Cricket(game);
            default:
                throw new Error('Unknown game type ' + game.type);
        }
    }
};