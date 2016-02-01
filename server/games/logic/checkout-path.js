/**
 * Class to calculate possible checkout paths for given points
 *
 * @type {CheckoutPath}
 */
CheckoutPath = class CheckoutPath {

    /**
     * Array to store the different checkout paths (ONE = with 1 dart; TWO = with 2 darts etc.)
     *
     * @type {{ONE: Array, TWO: Array, THREE: Array}}
     */
    paths = {
        ONE: [],
        TWO: [],
        THREE: []
    };

    constructor() {
        this.scores = new ScoresContainer();
        this.reset();
    };

    /**
     * Returns the calculated checkout paths
     *
     * @returns {{ONE: Array, TWO: Array, THREE: Array}}
     */
    getPaths = () => {
        return this.paths;
    };

    /**
     * Resets the calculated paths
     */
    reset = () => {
        this.paths.ONE = [];
        this.paths.TWO = [];
        this.paths.THREE = [];
    };

    /**
     * Validates if a calculation makes sense for the given params
     *
     * @param points
     * @param dartsRemaining
     */
    validate = (points, dartsRemaining) => {
        if (points > 170) {
            return false;
        }
        if (this.isCheckoutPossible()) {
            return false;
        }
        if (points > 100 && dartsRemaining < 3) {
            return false;
        }
        if ((points > 40 && 50 != points) && 1 == dartsRemaining) {
            return false;
        }
        return true;
    };

    /**
     * Recursive solution to calculate the checkout paths
     *
     * @param points
     * @param dartsRemaining
     * @param path
     */
    calculate = (points, dartsRemaining, path = []) => {

        if (0 == dartsRemaining || !this.validate(points, dartsRemaining)) {
            return;
        }

        if (dartsRemaining >= 2) {
            // Sub triples
            this.scores.triples.forEach((score) => {
                let myPath = path.slice();
                let newScore = points - score.score;
                if (newScore <= 0) {
                    return;
                }
                // We do not need a double hit for a score <= 20 - replace with single hit
                if (score.score <= 20) {
                    score = {
                        score: score.score,
                        fieldName: 'S' + score.score,
                        fieldType: 'S'
                    };
                }
                myPath.push(score);
                if (dartsRemaining > 1) {
                    this.calculate(newScore, dartsRemaining - 1, myPath)
                }
            });

            // Sub singles
            this.scores.singles.forEach((score) => {
                let myPath = path.slice();
                let newScore = points - score.score;
                if (newScore <= 0) {
                    return;
                }
                myPath.push(score);
                if (dartsRemaining > 1) {
                    this.calculate(newScore, dartsRemaining - 1, myPath);
                }
            });

        }

        // Sub doubles
        this.scores.doubles.forEach((score) => {
            let myPath = path.slice();
            let newScore = points - score.score;
            if (newScore < 0) {
                return;
            }
            // We do not need a double hit for a score <= 20 - replace with single hit
            if (score.value <= 20) {
                if (newScore > 20) {
                    score = {
                        score: score.score,
                        fieldName: 'S' + score.score,
                        fieldType: 'S'
                    };
                }
            }
            myPath.push(score);
            if (0 == newScore) {
                switch (myPath.length) {
                    case 1:
                        this.paths.ONE.push(myPath);
                        break;
                    case 2:
                        this.paths.TWO.push(myPath);
                        break;
                    case 3:
                        this.paths.THREE.push(myPath);
                        break;
                }
            } else {
                if (dartsRemaining > 1) {
                    this.calculate(newScore, dartsRemaining - 1, myPath);
                }
            }
        });
    };

    isCheckoutPossible = () => {
        return !(this.paths.ONE.length == 0 && this.paths.TWO.length == 0 && this.paths.THREE.length == 0);
    };
};