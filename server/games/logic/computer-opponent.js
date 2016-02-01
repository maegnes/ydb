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
        throw 'NOT_IMPLEMENTED_EXCEPTION';
    }

    get probabilities() {
        throw 'NOW IMPLEMENTED_EXCEPTION';
    }

    constructor(game) {
        this.scores = new ScoresContainer();
        this.game = game;
        this.computerPlayer = this.game.game.currentPlayer;
        this.simulatedDarts = 0;
    }

    /**
     * Calculates current scored average by the computer
     *
     * @param thrown
     * @param scored
     */
    calcAverage = (thrown, scored) => {
        if (0 == thrown || isNaN(thrown)) {
            return 0;
        }
        return Math.round((scored / thrown)) * 3;
    };

    /**
     * Opponent logic
     */
    play() {

        if (this.game.isLocked()) {
            return;
        }

        this.simulatedDarts++;

        if (this.simulatedDarts <= 3) {

            let currentPlayer = this.game.game.currentPlayer;

            if (this.computerPlayer == currentPlayer) {

                let checkoutPath = this.game.getCurrentPlayerObject().checkoutPath;

                if (checkoutPath) {
                    let fieldToScore = checkoutPath[0];
                    if (this.checkProbability(fieldToScore)) {
                        this.score(fieldToScore);
                    } else {
                        this.throwRandomDart(true);
                    }
                } else {
                    if (this.game.getCurrentPlayerObject().scoreRemaining <= 170) {
                        this.throwRandomDart(true);
                    } else {
                        this.throwRandomDart();
                    }
                }
            }
        }
    }

    /**
     * Throws a random dart based on the current difficulty level
     *
     * @param ignoreAverage
     */
    throwRandomDart(ignoreAverage = false) {

        for (t = 1; t <= 100; t++) {

            // Get a random score
            let randomScore = this.scores.getRandomScore();

            if('N' === randomScore.fieldType) {
                if (!this.checkProbability(randomScore)) {
                    continue;
                }
            }

            let virtualScoredPoints = this.game.getCurrentPlayerObject().totalPoints + randomScore.score;
            let dartsThrown = this.game.getCurrentPlayerObject().dartsThrown;

            // Calculate the avg with the new score
            let virtualAverage = this.calcAverage((dartsThrown + 1), virtualScoredPoints);

            // Does the virtual average fit into the range?
            if (ignoreAverage || (virtualAverage >= this.range.min && virtualAverage <= this.range.max)) {

                // Throw the virtual dart
                this.score(randomScore);

                break;

            }
        }

        if (101 == t) {

            // If it wasn't possible to find a possible score, calculate a accurate score based on the difficulty
            let scoreCenter = Math.floor(this.range.max / 2);
            let score = this.scores.getRandomScoreByRange({
                min: Math.max(scoreCenter - 5, 1),
                max: Math.min(scoreCenter + 5, 60)
            });

            this.score(score);

        }

    };

    /**
     * Throws the virtual dart
     *
     * @param score
     */
    score(score) {
        this.game.score(score);
        this.nextDart();
    }

    checkProbability(score) {
        return (Math.random() <= (this.probabilities[score.fieldType] / 100));
    }

    /**
     * Tells the virtual opponent to throw the next dart in 1 second
     */
    nextDart = () => {
        Meteor.setTimeout(
            () => {
                this.play();
            },
            (2000)
        );
    };
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

    get probabilities() {
        return {
            'S': 30,
            'D': 5,
            'T': 5,
            'N': 20
        }
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

    get probabilities() {
        return {
            'S': 40,
            'D': 10,
            'T': 15,
            'N': 10
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
            max: 65
        }
    }

    get probabilities() {
        return {
            'S': 65,
            'D': 20,
            'T': 25,
            'N': 5
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

    get probabilities() {
        return {
            'S': 80,
            'D': 30,
            'T': 35,
            'N': 0
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

    get probabilities() {
        return {
            'S': 95,
            'D': 40,
            'T': 45,
            'N': 0
        }
    }
};