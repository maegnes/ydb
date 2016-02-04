/**
 * Class queries mongodb to retrieve user stats
 *
 * @type {UserStats}
 */
UserStats = class UserStats {

    /**
     * Retrieves the quick stats for the user dashboard
     *
     * @param userId
     * @returns {{gamesPlayed: *, gamesWon: number, pctWon: number}}
     */
    static getQuickStats = (userId) => {
        let selector = {
            $and: [
                {
                    $and: [
                        {finished: true}
                    ]
                },
                {
                    players: {
                        $elemMatch: {
                            _id: userId
                        }
                    }
                },
                {
                    $where: "this.players.length > 1"
                }
            ]
        };
        let games = Games.find(selector);
        let gamesPlayed = games.count();
        let gamesWon = 0;
        games.forEach(
            (game) => {
                if (game.winner === userId) {
                    gamesWon++;
                }
            }
        );
        return {
            gamesPlayed: gamesPlayed,
            gamesWon: gamesWon,
            pctWon: (isNaN(Math.round((100 / gamesPlayed) * gamesWon))) ? 0 : Math.round((100 / gamesPlayed) * gamesWon),
            avg: UserStats.getAverages(userId)
        }
    };

    /**
     * Calculates the
     * @param userId
     * @param gameId
     * @returns {*}
     */
    static getAverages = (userId = 0, gameId = 0) => {

        let selector = [];

        selector.push(
            {
                $unwind: "$players"
            },
            {
                $unwind: "$players.scores"
            },
            {
                $unwind: "$players.scores"
            },
            {
                $unwind: "$players.scores"
            }
        );

        if (gameId != 0) {
            selector.push(
                {
                    $match: {
                        "_id": gameId
                    }
                }
            );
        }

        // Check if we should limit on game or user
        if (userId != 0) {
            selector.push(
                {
                    $match: {
                        "players._id": userId
                    }
                }
            );
        }

        selector.push(
            {
                $group: {
                    "_id": "$players.user._id",
                    "totalPoints": {
                        $sum: "$players.scores.score"
                    },
                    "dartsThrown": {
                        $sum: 1
                    }
                }
            },
            {
                "$project": {
                    "dartsThrown": "$dartsThrown",
                    "totalPoints": "$totalPoints",
                    "AVG": {
                        $divide: ["$totalPoints", "$dartsThrown"]
                    },
                    "TDAVG": {
                        $multiply: [
                            3, {
                                $divide: ["$totalPoints", "$dartsThrown"]
                            }
                        ]
                    }
                }
            },
            {
                $sort: {_id: -1}
            }
        );

        let result = Games.aggregate(selector);
        return result[0];
    };

    /**
     * Calculates the checkout percentage for a given user (game optional)
     *
     * @param userId
     * @param gameId
     */
    static getCheckoutPercentage = (userId, gameId = 0) => {

        let aggregationPipeline = [];

        // Unwind players
        aggregationPipeline.push(
            {
                $unwind: "$players"
            }
        );

        aggregationPipeline.push(
            {
                $match: {
                    "players._id": userId
                }
            }
        );

        if (gameId != 0) {
            aggregationPipeline.push(
                {
                    $match: {
                        "_id": gameId
                    }
                }
            );
        }

        aggregationPipeline.push(
            {
                $group: {
                    "_id": "$players._id",
                    "checkoutAttempts": {
                        $sum: "$players.checkoutAttempts"
                    },
                    "checkouts": {
                        $sum: "$players.checkouts"
                    }
                }
            }
        );

        aggregationPipeline.push(
            {
                $project: {
                    "checkoutAttempts": "$checkoutAttempts",
                    "checkouts": "$checkouts",
                    "checkoutPercentage": {
                        $multiply: [
                            100, {
                                $divide: ["$checkouts", "$checkoutAttempts"]
                            }
                        ]
                    }
                }
            }
        );

        let result = Games.aggregate(aggregationPipeline);
        return result[0];
    };
};