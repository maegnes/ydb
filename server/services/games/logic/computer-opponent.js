/**
 * Class handles algorithm for computer opponents
 *
 * @type {ComputerOpponent}
 */
ComputerOpponent = class ComputerOpponent {

    /**
     * Must be overwritten in sub classes
     */
    get range() {
        throw 'NOT_IMPLEMENTED_EXCEPTION';
    }

    /**
     * Must be overwritten in the sub classes
     */
    get probabilities() {
        throw 'NOW IMPLEMENTED_EXCEPTION';
    }

    /**
     * Constructor
     *
     * @param gameWrapper
     */
    constructor(gameWrapper) {

        // Create ScoresContainer object
        this.scores = new ScoresContainer();

        // Set game wrapper to class property
        this.gameWrapper = gameWrapper;

        // Extract the game object out of the wrapper
        this.gameObject = gameWrapper.game;

        // Extract the computer player to check if it is still the computers turn
        this.computerPlayer = this.gameObject.currentPlayer;

        // Count the thrown darts of the computer opponent
        this.simulatedDarts = 0;
    }

    /**
     * Calculates current scored average by the computer
     *
     * @param thrown
     * @param scored
     */
    calcAverage(thrown, scored) {
        if (0 == thrown || isNaN(thrown)) {
            return 0;
        }
        // As the checkout probability has direct impact on the average we must include it into the calculation
        let checkoutsNeeded = (this.gameObject.firstToSets * 3);
        let checkoutErrors = Math.round((checkoutsNeeded * 3 / 100) * (100 - this.probabilities.D));
        let checkoutErrorsPerLeg = checkoutErrors / checkoutsNeeded;
        let checkoutErrorsProRata = Math.round(checkoutErrorsPerLeg * this.gameWrapper.getTheoreticalPlayedLegs());
        thrown += checkoutErrorsProRata;
        return Math.round((scored / thrown)) * 3;
    };

    /**
     * Opponent logic
     */
    play() {

        // If the game is locked, no need for the opponent to play
        if (this.gameWrapper.isLocked()) {
            return;
        }

        this.simulatedDarts++;

        if (this.simulatedDarts <= 3) {

            let currentPlayer = this.gameObject.currentPlayer;

            // Check if the current player is the same as on the startup
            if (this.computerPlayer == currentPlayer) {

                // Check if the computer opponent reached the checkout region
                let checkoutPath = this.gameWrapper.getCurrentPlayerObject().checkoutPath;

                if (checkoutPath) {

                    // Get the next field
                    let fieldToScore = checkoutPath[0];

                    // Check the hit probability of the computer
                    if (this.checkProbability(fieldToScore)) {
                        // Opponent hit the field!
                        this.score(fieldToScore);
                    } else {
                        // Opponent didn't hit - throw appropriate dart
                        this.throwAppropriateDart();
                    }
                } else {
                    // Opponent is not in the checkout region
                    if (this.gameWrapper.getCurrentPlayerObject().scoreRemaining <= 170) {
                        this.throwAppropriateDart();
                    } else {
                        // If no dart has been thrown yet, throw appropriate dart
                        if (0 == this.gameWrapper.getCurrentPlayerObject().dartsThrown) {
                            this.throwAppropriateDart();
                        } else {
                            this.throwRandomDart();
                        }
                    }
                }
            }
        }
    }

    /**
     * Throws a random dart based on the current difficulty level
     *
     * @param ignoreAverage - ignore the current average for this dart?
     */
    throwRandomDart(ignoreAverage = false) {

        // 100 attempts to find a proper score
        for (t = 1; t <= 100; t++) {

            // Fetch a random score
            let randomScore = this.scores.getRandomScore();

            // If the opponent missed the board, check the probability (as this is very rare)
            if('N' === randomScore.fieldType) {
                if (!this.checkProbability(randomScore)) {
                    continue;
                }
            }

            let virtualScoredPoints = this.gameWrapper.getCurrentPlayerObject().totalPoints + randomScore.score;
            let dartsThrown = this.gameWrapper.getCurrentPlayerObject().dartsThrown;

            // Calculate the avg with the new score
            let virtualAverage = this.calcAverage((dartsThrown + 1), virtualScoredPoints);

            // Does the virtual average fit into the range?
            if (ignoreAverage || (virtualAverage >= this.range.min && virtualAverage <= this.range.max)) {

                // Throw the virtual dart
                this.score(randomScore);

                break;

            }
        }

        // We could not find a score - throw a appropriate dart
        if (101 == t) {
            // If it wasn't possible to find a possible score, throw a appropriate score based on the difficulty
            this.throwAppropriateDart();
        }
    }

    /**
     * Throws a dart appropriate based on the opponents difficulty level
     */
    throwAppropriateDart() {

        // Calculate a score range for the current difficulty level
        let scoreCenter = Math.floor(this.range.max / 2);
        let range = {};

        // Minimum must be 1
        range.min = Math.max(scoreCenter - 5, 1);

        // Maximum must be 60 with one throw
        range.max = Math.min(scoreCenter + 5, 60);

        if (this.gameWrapper.getCurrentPlayerObject().scoreRemaining <= 60) {
            // Check if a "overthrow" is probable for the current opponent
            if (!this.checkProbability(null, 'OT')) {
                // The opponent is too strong. Create a range matching the current score and avoid overthrowing
                range.min = 1;
                range.max = Math.max(this.gameWrapper.getCurrentPlayerObject().scoreRemaining - 2, 2);
            }
        }

        // Find a proper score
        let score = this.scores.getRandomScoreByRange(range);

        // "Throw" the matched score
        this.score(score);
    }

    /**
     * Throws the virtual dart
     *
     * @param score
     */
    score(score) {
        this.gameWrapper.score(score);
        this.nextDart();
    }

    /**
     * Check the probability of the given field hit based on the difficulty level
     *
     * @param score
     * @param fieldType
     * @returns {boolean}
     */
    checkProbability(score, fieldType = false) {
        if (!fieldType) {
            fieldType = score.fieldType;
        }
        // Use generally distributed random() function to check probability
        return ((Math.floor(Math.random() * (100 - 1)) + 1) <= this.probabilities[fieldType]);
    }

    /**
     * Tells the virtual opponent to throw the next dart in 1.5 seconds
     */
    nextDart() {
        Meteor.setTimeout(
            () => {
                this.play();
            },
            (1500)
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
            min: 5,
            max: 15
        };
    }

    get probabilities() {
        return {
            'S': 30,
            'D': 5,
            'T': 5,
            'N': 20,
            'OT': 60
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
            min: 15,
            max: 35
        }
    }

    get probabilities() {
        return {
            'S': 40,
            'D': 10,
            'T': 15,
            'N': 10,
            'OT': 40
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
            min: 35,
            max: 55
        }
    }

    get probabilities() {
        return {
            'S': 65,
            'D': 20,
            'T': 25,
            'N': 5,
            'OT': 20
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
            min: 55,
            max: 75
        }
    }

    get probabilities() {
        return {
            'S': 80,
            'D': 30,
            'T': 35,
            'N': 5,
            'OT': 10
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
            min: 75,
            max: 115
        }
    }

    get probabilities() {
        return {
            'S': 95,
            'D': 40,
            'T': 45,
            'N': 3,
            'OT': 5
        }
    }
};