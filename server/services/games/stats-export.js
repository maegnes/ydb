/**
 * Exports statistics information of a given game into a separate collection for better aggregation
 *
 * @type {StatsExport}
 */
StatsExport = class StatsExport {

    userStats = {};

    resetStats = () => {
        this.userStats.thrownDarts = 0;
        this.userStats.thrownSingles = 0;
        this.userStats.thrownDoubles = 0;
        this.userStats.thrownTriples = 0;
        this.userStats.thrownNoScore = 0;
        this.userStats.scoredPoints = 0;
    };

    /**
     * Extracts stats from the finished game into separate collection
     *
     * @param game
     */
    extract = (game) => {

        this.resetStats();

        if ("object" === typeof game) {

            game.players.forEach((player) => {

                this.userStats.gameId = game._id;
                this.userStats.userId = player._id;
                this.userStats.set = 0;
                this.userStats.leg = 0;

                player.scores.forEach((set) => {
                    this.userStats.set++;
                    this.userStats.leg = 0;
                    set.forEach((leg) => {
                        this.userStats.leg++;
                        this.userStats.thrownDarts += leg.length;
                        leg.forEach((score) => {
                            this.userStats.scoredPoints += score.score;
                            switch (score.fieldType) {
                                case "S":
                                    this.userStats.thrownSingles++;
                                    break;
                                case "D":
                                    this.userStats.thrownDoubles++;
                                    break;
                                case "T":
                                    this.userStats.thrownTriples++;
                                    break;
                                case "N":
                                    this.userStats.thrownNoScore++;
                                    break;
                            }
                        });
                        Stats.insert(this.userStats);
                        this.resetStats();
                    });
                });
            });
        }
    }
};