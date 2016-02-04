/**
 * Defines which kind of games should be synced to the client
 */
Meteor.publish("games", function (options) {

    let selector = {
        $or: [
            // Public games
            {
                $and: [
                    {'visibility': true},
                    {'visibility': {$exists: true}}
                ]
            },
            // Games where the current user is the owner
            {
                $and: [
                    {"owner._id": this.userId}
                ]
            },
            // Games where the current player is in
            {
                players: {
                    $elemMatch: {
                        _id: this.userId
                    }
                }
            }
        ]
    };

    // Sync games to the client
    return Games.find(selector, options);

});