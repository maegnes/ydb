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
    }
});