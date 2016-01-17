/**
 * Class to calculate possible checkout paths for given points
 *
 * @type {CheckoutPath}
 */
CheckoutPath = class CheckoutPath {

    /**
     * Array with the available single fields
     *
     * @type {*[]}
     */
    singles = [
        {
            value: 25,
            name: 'Single Bull'
        }
    ];

    /**
     * Array with the available double fields
     *
     * @type {*[]}
     */
    doubles = [
        {
            value: 50,
            name: 'Bullseye'
        }
    ];

    /**
     * Array with the available triple fields
     *
     * @type {*[]}
     */
    triples = [];

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

    /**
     * Creates the fields and their values
     */
    constructor() {
        for (var i = 1; i <= 20; i++) {
            this.singles.push(
                {
                    value: i,
                    name: 'S' + i
                }
            );
            this.doubles.push(
                {
                    value: 2 * i,
                    name: 'D' + i
                }
            );
            this.triples.push(
                {
                    value: 3 * i,
                    name: 'T' + i
                }
            );
        }
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
     * Recursive solution to calculate the checkout paths
     *
     * @param points
     * @param dartsRemaining
     * @param path
     */
    calculate = (points, dartsRemaining, path = []) => {

        if (0 == dartsRemaining) {
            return;
        }

        // Sub doubles
        this.triples.forEach((score) => {
            let myPath = path.slice();
            let newScore = points - score.value;
            if (newScore <= 0) {
                return;
            }
            myPath.push(score);
            this.calculate(newScore, dartsRemaining - 1, myPath)
        });

        // Sub singles
        this.singles.forEach((score) => {
            let myPath = path.slice();
            let newScore = points - score.value;
            if (newScore <= 0) {
                return;
            }
            myPath.push(score);
            this.calculate(newScore, dartsRemaining - 1, myPath);
        });

        // Sub triples
        this.doubles.forEach((score) => {
            let myPath = path.slice();
            let newScore = points - score.value;
            if (newScore < 0) {
                return;
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
                }
            } else {
                this.calculate(newScore, dartsRemaining - 1, myPath);
            }
        });
    };

    isCheckoutPossible = () => {
        return !(this.paths.ONE.length == 0 && this.paths.TWO.length == 0 && this.paths.THREE.length == 0);
    }
};