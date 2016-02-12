/**
 * Provides server side API to calculate a players accuracy
 */
Meteor.methods({
    calculateAccuracy: (playerId, throws) => {
        // Receives client data and calculates accuracy
        let accuracy = new AccuracyCalculation(throws);
        return accuracy.calculate();
    }
});