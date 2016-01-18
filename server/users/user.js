Meteor.methods({
    /**
     * Validates the password for the given userId
     *
     * @param username
     * @param digest
     * @returns {boolean}
     */
    checkPassword: (username, digest) => {
        let user = Meteor.users.findOne({username: username});
        if (user) {
            let password = {digest: digest, algorithm: 'sha-256'};
            let result = Accounts._checkPassword(user, password);
            return (result.error == null) ? user._id : false;
        }
        return false;
    },

    /**
     * Returns the current player for the client
     *
     * @param userId
     * @returns {any}
     */
    getCurrentPlayer: (userId) => {
        return Meteor.users.findOne(userId);
    },

    /**
     * Returns quick stats for a given user
     *
     * @param userId
     * @returns {{new: number, old: number}}
     */
    getQuickStats: (userId) => {
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
            }
            ;
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
            pctWon: Math.round((100 / gamesPlayed) * gamesWon)
        }
    }
})
;