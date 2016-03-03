/**
 * Provides server side API to calculate a players accuracy
 */
Meteor.methods({
    calculateAccuracy: (playerId, throws) => {
        // Receives client data and calculates accuracy
        let accuracy = new AccuracyCalculation(throws);
        let estimatedAccuracy = accuracy.calculate();

        // Save the calculated accuracy to the users profile
        Meteor.users.update(
            {
                _id: playerId
            },
            {
                $push: {
                    "profile.accuracy": {
                        date: new Date(),
                        accuracy: estimatedAccuracy
                    }
                }
            }
        );

        return estimatedAccuracy
    }
});