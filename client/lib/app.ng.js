import { Meteor } from 'meteor/meteor';
import angular from 'angular';

// Load angular module
let ydb = angular.module('ydb', ['angular-meteor', 'ui.router']);

/**
 * Check if meteor is connected to the backend
 */
ydb.run(
    ($rootScope) = {
        connectedToBackend: function() {
            return Meteor.status().connected;
        }
    }
);

/**
 * Define a template helper to create loops
 */
ydb.filter('range', () => {
    return (input, start, end) => {
        start = parseInt(start);
        end = parseInt(end);
        for (var i = start; i <= end; i++) {
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
