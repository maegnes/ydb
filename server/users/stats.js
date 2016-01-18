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
        UserStats.getThreeDartsAverage(userId);
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
            avg: UserStats.getThreeDartsAverage(userId)
        }
    };

    static getThreeDartsAverage = (userId = 0, gameId = 0) => {

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

        if (gameId != 0) {
            selector.push(
                {
                    $match: {
                        "_id": gameId
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
        console.log(result);
        return result[0];
    };
};