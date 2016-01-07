angular.module('ydb').directive('dashboard', function() {
    return {
        restrict: 'E',
        templateUrl: 'client/ydb/internal/dashboard/dashboard.html',
        controllerAs: 'dashboard',
        controller: function($scope, $reactive, $state) {
            $reactive(this).attach($scope);

            this.subscribe("games");

            this.helpers({
                games: () => {
                    return Games.find({});
                }
            });

            this.clearGames = () => {
                Meteor.call('startGame', 1, 2);
            }
        }
    }
});