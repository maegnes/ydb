/**
 * Provides possible scores for the server classes
 *
 * @type {ScoresContainer}
 */
ScoresContainer = class ScoresContainer {

    /**
     * Defines a no score score
     * @type {{score: number, fieldName: string, fieldType: string}}
     */
    noScore = {
        score: 0,
        fieldName: "No Score",
        fieldType: 'N'
    };

    /**
     * Array with the available single fields
     *
     * @type {*[]}
     */
    singles = [
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
    doubles = [
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
    triples = [];

    /**
     * Creates the scores and their values
     */
    constructor() {
        for (var i = 1; i <= 20; i++) {
            this.singles.push(
                {
                    score: i,
                    fieldName: i,
                    fieldType: 'S'
                }
            );
            this.doubles.push(
                {
                    score: 2 * i,
                    fieldName: 'D' + i,
                    fieldType: 'D'
                }
            );
            this.triples.push(
                {
                    score: 3 * i,
                    fieldName: 'T' + i,
                    fieldType: 'T'
                }
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
        // As the given range is the three darts average divide by 3 to receive one darts average
        while(true) {
            let randomScore = this.getRandomScore();
            if (randomScore.score >= range.min && randomScore.score <= range.max) {
                return randomScore;
            }
        }
    }
};