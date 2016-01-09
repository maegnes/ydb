Meteor.publish("games", function (options) {

    // Just publish public games or the owners own games
    let selector = {
        $or: [
            {
                $and: [
                    {'visibility': true},
                    {'visibility': {$exists: true}}
                ]
            },
            {
                $and: [
                    {owner: Meteor.users.findOne(this.userId)}
                ]
            }
        ]
    };

    return Games.find(selector, options);

});