/**
 * Factory class to create a computer opponent
 *
 * @type {ComputerOpponentFactory}
 */
class ComputerOpponentFactory {

    /**
     * Creates the opponent based on the difficulty level
     *
     * @param gameWrapper
     * @returns {ComputerOpponent}
     */
    static create(gameWrapper) {
        switch (gameWrapper.game.difficulty) {
            case 1:
                return new AbsoluteBeginner(gameWrapper);
            case 2:
                return new SporadicPlayer(gameWrapper);
            case 3:
                return new RegularPlayer(gameWrapper);
            case 4:
                return new GreatPlayer(gameWrapper);
            case 5:
                return new WorldClassPlayer(gameWrapper);
            default:
                throw 'Difficulty Level ' + difficultyLevel + ' is unknown!';
        }
    }
};