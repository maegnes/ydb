Meteor.startup(function () {
    if (Games.find().count() === 0) {
        console.log("currently no games available!");
    }
});