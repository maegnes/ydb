// Modul laden
let ydb = angular.module('ydb', ['angular-meteor', 'ui.router']);


ydb.run(
    ($rootScope) => {
        $rootScope.connectedToBackend = () => {
            return Meteor.status().connected;
        };
    }
);

ydb.filter('range', function() {
    return function(input, total) {
        total = parseInt(total);

        for (var i=0; i<total; i++) {
            input.push(i);
        }

        return input;
    };
});
