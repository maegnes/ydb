/**
 * Provides server side logic for a players accuracy
 */
Meteor.methods({
    calculateAccuracy: (playerId, data) => {
        let accuracy = new AccuracyCalculation(data);
        return accuracy.calculate();
    }
});