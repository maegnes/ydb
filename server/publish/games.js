Meteor.publish("games", function (options) {

    // Just publish public games or the owners own games
    let selector = {
        $or: [
            {
                $and: [
                    {'public': true},
                    {'public': {$exists: true}}
                ]
            },
            {
                $and: [
                    {owner: this.userId},
                    {owner: {$exists: true}}
                ]
            }
        ]
    };

    return Games.find(selector, options);

});