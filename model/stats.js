Stats = new Mongo.Collection("stats");

Stats.allow({
    insert: function (userId, game) {
        return true;
    },
    update: function (userId, game) {
        return true;
    },
    remove: function (userId, game) {
        return false;
    }
});