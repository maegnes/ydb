// Modul laden
let ydb = angular.module('ydb', ['angular-meteor', 'ui.router']);


ydb.run(
    ($rootScope) => {
        $rootScope.connectedToBackend = () => {
            return Meteor.status().connected;
        };
    }
);

ydb.filter('range', () => {
    return (input, total) => {
        total = parseInt(total);
        for (var i=0; i<total; i++) {
            input.push(i);
        }
        return input;
    };
});

ydb.factory('dartBoardCreator', () => {
    return new Dartboard("", "");
});

/**
 * Creates the available game types
 */
ydb.factory('availableGameTypes', () => {
    return [
        {
            name: '501 Game',
            value: 501
        },
        {
            name: '401 Game',
            value: 401
        },
        {
            name: '301 Game',
            value: 301
        },
        {
            name: '201 Game',
            value: 201
        }
    ]
});

/**
 * Creates the available game modes
 */
ydb.factory('availableGameModes', () => {
    return [
        {
            name: 'First to 1 set',
            firstToSets: 1
        },
        {
            name: 'First to 2 sets',
            firstToSets: 2
        },
        {
            name: 'First to 3 sets',
            firstToSets: 3
        },
        {
            name: 'First to 4 sets',
            firstToSets: 4
        },
        {
            name: 'First to 5 sets',
            firstToSets: 5
        }
    ];
});

ydb.factory('difficultyLevels', () => {
    return [
        {
            name: 'Absolute Beginner',
            value: 1
        },
        {
            name: 'Sporadic player',
            value: 2
        },
        {
            name: 'Regular player',
            value: 3
        },
        {
            name: 'Great player',
            value: 4
        },
        {
            name: 'World class',
            value: 5
        }
    ];
});
