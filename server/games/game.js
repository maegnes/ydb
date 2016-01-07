// Store the serverside games logic here
Meteor.methods({
    startGame: (gameId, userId) => {
        Games.remove({});
    }
});