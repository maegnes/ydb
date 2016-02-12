/**
 * Directive for the stats page
 */
angular.module('ydb').directive('stats', function() {
    return {
        restrict: 'E',
        templateUrl: 'client/ydb/internal/stats/stats.html',
        controllerAs: 'game',
        controller: function($scope) {

            /**
             * Holds our stats
             *
             * @type {Array}
             */
            $scope.stats = [];

            /**
             * Loads stats from the server
             */
            $scope.loadStats = () => {
                Meteor.call(
                    'getCheckoutPercentage',
                    Meteor.userId(),
                    0,
                    (err, res) => {
                        if (err) {
                            alert('Error while retrieving the checkout percentage');
                        } else {
                            $scope.stats.checkoutPercentage = res.checkoutPercentage;
                            $scope.$apply();
                        }
                    }
                );
                Meteor.call(
                    'getQuickStats',
                    Meteor.userId(),
                    (err, res) => {
                        if (err) {
                            alert('Error while retrieving the quick stats');
                        } else {
                            $scope.stats.avg = res;
                            $scope.$apply();
                        }
                    }
                );
            };

            // Load stats
            $scope.loadStats();
        }
    }
});