/**
 * Accuracy calculation directive
 */
angular.module('ydb').directive('accuracy', function() {
    return {
        restrict: 'E',
        templateUrl: 'client/ydb/internal/accuracy/accuracy.html',
        controllerAs: 'accuracy',
        controller: function($scope) {

            /**
             * Stores the marked hits
             *
             * @type {Array}
             */
            $scope.hits = [];

            /**
             * Calculated accuracy
             *
             * @type {number}
             */
            $scope.accuracy = 0;

            /**
             * Listen for the throwEvent. Is being emitted by the drawn dartboard
             */
            $scope.$on("positionEvent", function (event, data) {
                $scope.hits.push(data);
                $scope.$apply();
            });

            /**
             * Starts server side calculation
             */
            $scope.calculate = function() {
                Meteor.call(
                    'calculateAccuracy',
                    Meteor.userId(),
                    $scope.hits,
                    (err, res) => {
                        if (err) {

                        } else {
                            $scope.accuracy = res;
                            $scope.$apply();
                        }
                    }
                );
            };

            /**
             * Checks if the player has thrown enough darts
             *
             * @returns {boolean}
             */
            $scope.enoughDartsThrown = function() {
                return $scope.hits.length >= 50;
            };
        }
    }
});