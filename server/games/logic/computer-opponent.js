/**
 * Class handles algorithm for computer opponents
 *
 * @type {ComputerOpponent}
 */
ComputerOpponent = class ComputerOpponent {

    /**
     * Must be overwritten in sub classes
     *
     * @returns {{}}
     */
    get range() {
        throw 'METHOD_NOT_IMPLEMENTED_EXCEPTION';
    }

    /**
     * Creates the opponent based on the difficulty level
     *
     * @param difficultyLevel
     * @returns {ComputerOpponent}
     */
    static create(difficultyLevel = 1) {
        switch (difficultyLevel) {
            case 1:
                return new AbsoluteBeginner();
            case 2:
                return new SporadicPlayer();
            case 3:
                return new RegularPlayer();
            case 4:
                return new GreatPlayer();
            case 5:
                return new WorldClassPlayer();
            default:
                throw 'Difficulty Level ' + difficultyLevel + ' is unknown!';
        }
    }

    constructor() {

    }
};

/**
 * Class for an absolute beginner opponent
 *
 * @type {AbsoluteBeginner}
 */
AbsoluteBeginner = class AbsoluteBeginner extends ComputerOpponent {
    get range() {
        return {
            min: 10,
            max: 25
        };
    }
 };

/**
 * Class for a sporadic player opponent
 *
 * @type {SporadicPlayer}
 */
SporadicPlayer = class SporadicPlayer extends ComputerOpponent {
    get range() {
        return {
            min: 25,
            max: 45
        }
    }
};

/**
 * Class for a regular player opponent
 *
 * @type {RegularPlayer}
 */
RegularPlayer = class RegularPlayer extends ComputerOpponent {
    get range() {
        return {
            min: 45,
            max: 46
        }
    }
};

/**
 * Class for a great player opponent
 *
 * @type {GreatPlayer}
 */
GreatPlayer = class GreatPlayer extends ComputerOpponent {
    get range() {
        return {
            min: 65,
            max: 85
        }
    }
};

/**
 * Class for a world class opponent
 *
 * @type {WorldClassPlayer}
 */
WorldClassPlayer = class WorldClassPlayer extends ComputerOpponent {
    get range() {
        return {
            min: 85,
            max: 115
        }
    }
};