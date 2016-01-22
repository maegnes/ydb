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
     * Returns the quick stats
     *
     * @param userId
     * @returns {{gamesPlayed, gamesWon, pctWon}|{gamesPlayed: *, gamesWon: number, pctWon: number}}
     */
    getQuickStats: (userId) => {
        return UserStats.getQuickStats(userId);
    },

    /**
     * Returns the checkout percentage for the given user
     *
     * @param userId
     * @param gameId
     */
    getCheckoutPercentage: (userId, gameId = 0) => {
        return UserStats.getCheckoutPercentage(userId, gameId);
    }
});