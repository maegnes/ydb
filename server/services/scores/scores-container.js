/**
 * Provides possible scores and helper methods for the server scores handling
 *
 * @type {ScoresContainer}
 */
ScoresContainer = class ScoresContainer {

    /**
     * Creates the scores and their values
     */
    constructor() {
        /**
         * Defines a no score score
         * @type {{score: number, fieldName: string, fieldType: string}}
         */
        this.noScore = {
            score: 0,
            fieldName: "No Score",
            fieldType: 'N'
        };

        /**
         * Array with the available single fields
         *
         * @type {*[]}
         */
        this.singles = [
            {
                score: 25,
                fieldName: 'Single Bull',
                fieldType: 'S'
            }
        ];

        /**
         * Array with the available double fields
         *
         * @type {*[]}
         */
        this.doubles = [
            {
                score: 50,
                fieldName: 'Bullseye',
                fieldType: 'D'
            }
        ];

        /**
         * Array with the available triple fields
         *
         * @type {*[]}
         */
        this.triples = [];

        for (var i = 1; i <= 20; i++) {
            this.singles.push(
                ScoresContainer.createScore(i, 'S')
            );
            this.doubles.push(
                ScoresContainer.createScore(i, 'D')
            );
            this.triples.push(
                ScoresContainer.createScore(i, 'T')
            );
        }
    };

    /**
     * Returns a random score
     *
     * @returns {*}
     */
    getRandomScore() {
        switch(Math.floor(Math.random() * 4)) {
            case 0:
                return this.noScore;
            case 1:
                return this.singles[Math.floor(Math.random() * this.singles.length)];
            case 2:
                return this.doubles[Math.floor(Math.random() * this.doubles.length)];
            case 3:
                return this.triples[Math.floor(Math.random() * this.triples.length)];
        }
    };

    /**
     * Returns a score matching the given range
     *
     * @param range
     */
    getRandomScoreByRange(range) {
        while(true) {
            let randomScore = this.getRandomScore();
            if (randomScore.score >= range.min && randomScore.score <= range.max) {
                return randomScore;
            }
        }
    }

    /**
     * Creates a score object based on score and type
     *
     * @param score
     * @param type
     */
    static createScore(score, type) {
        let returnScore = score * (('T' == type) ? 3 : ('D' == type ? 2 : 1));
        let fieldName = (type == 'N') ? 'No Score' : type + score;
        return {
            score: returnScore,
            fieldName: fieldName,
            fieldType: type
        };
    }
};