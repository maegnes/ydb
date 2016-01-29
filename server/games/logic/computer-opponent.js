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

    get probability() {
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
        if (0 == thrown) {
            return 0;
        }
        return Math.round((scored / thrown)) * 3;
    };

    /**
     * Tells the computer opponent to throw a virtual dart
     */
    play() {

        this.simulatedDarts++;

        if (this.simulatedDarts <= 3) {

            let dartsThrown = this.game.getCurrentPlayerScores().length;
            let scoredPoints = this.game.startingPoints - this.game.getCurrentPlayerObject().scoreRemaining;
            let currentPlayer = this.game.game.currentPlayer;
            let pointsToGo = this.game.startingPoints - scoredPoints;

            if (this.computerPlayer == currentPlayer) {

                for (t = 1; t <= 100; t++) {

                    // Get a random score
                    let randomScore = this.scores.getRandomScore();

                    let virtualScoredPoints = scoredPoints + randomScore.score;

                    // Calculate the avg with the new score
                    let virtualAverage = this.calcAverage((dartsThrown + 1), virtualScoredPoints);

                    // Does the virtual average fit into the range?
                    if (virtualAverage >= this.range.min && virtualAverage <= this.range.max) {

                        dartsThrown++;
                        scoredPoints += randomScore.score;

                        // Throw the virtual dart
                        this.game.score(randomScore);

                        // Play the next dart in one second
                        this.nextDart();

                        break;

                    }
                }

                if (101 == t) {
                    let checkoutPath = this.game.getCurrentPlayerObject().checkoutPath;
                    if (checkoutPath) {
                        console.log("checkout möglich!");
                        if (1 == checkoutPath.length) {
                        }
                    }
                    if (pointsToGo <= 170) {
                        this.game.score(this.scores.getRandomScoreByRange(this.range));
                        this.nextDart();
                    }
                }

            }
        }
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
    get probability() {
        return {
            'S': 1,
            'D': 1,
            'T': 1
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
    get probability() {
        return {
            'S': 1,
            'D': 1,
            'T': 1
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
    get probability() {
        return {
            'S': 1,
            'D': 1,
            'T': 1
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
    get probability() {
        return {
            'S': 1,
            'D': 1,
            'T': 1
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
    get probability() {
        return {
            'S': 95,
            'D': 40,
            'T': 50
        }
    }
};