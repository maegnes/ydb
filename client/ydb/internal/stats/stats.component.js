angular.module('ydb').directive('stats', function() {
    return {
        restrict: 'E',
        templateUrl: 'client/ydb/internal/stats/stats.html',
        controllerAs: 'game',
        controller: function($scope, $reactive, $state, $stateParams) {

            //$reactive(this).attach($scope);

            $scope.stats = [];

            $scope.loadStats = () => {
                Meteor.call(
                    'getCheckoutPercentage',
                    Meteor.userId(),
                    0,
                    (err, res) => {
                        $scope.stats.checkoutPercentage = res.checkoutPercentage;
                        $scope.$apply();
                    }
                );
                Meteor.call(
                    'getQuickStats',
                    Meteor.userId(),
                    (err, res) => {
                        $scope.stats.avg = res;
                        $scope.$apply();
                        console.log($scope.stats);
                    }
                );
            };

            $scope.loadStats();
        }
    }
});