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
                    {"owner._id": this.userId}
                ]
            }
        ]
    };

    console.log(selector);

    return Games.find(selector, options);

});