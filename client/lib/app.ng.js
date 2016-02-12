// Load angular module
let ydb = angular.module('ydb', ['angular-meteor', 'ui.router']);

/**
 * Check if meteor is connected to the backend
 */
ydb.run(
    ($rootScope) => {
        $rootScope.connectedToBackend = () => {
            return Meteor.status().connected;
        };
    }
);

/**
 * Define a template helper to create loops
 */
ydb.filter('range', () => {
    return (input, total) => {
        total = parseInt(total);
        for (var i=0; i<total; i++) {
            input.push(i);
        }
        return input;
    };
});

/**
 * Factory for the dartboard class
 */
ydb.factory('dartBoardCreator', () => {
    return new Dartboard("", "");
});

/**
 * Creates the available game types
 */
ydb.factory('availableGameTypes', () => {
    return Meteor.settings.public.availableGameTypes;
});

/**
 * Creates the available game modes
 */
ydb.factory('availableGameModes', () => {
    return Meteor.settings.public.availableGameModes;
});

/**
 * Creates the available difficulty levels
 */
ydb.factory('availableDifficultyLevels', () => {
    return Meteor.settings.public.availableDifficultyLevels
});
