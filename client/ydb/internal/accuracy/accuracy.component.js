angular.module('ydb').directive('accuracy', function() {
    return {
        restrict: 'E',
        templateUrl: 'client/ydb/internal/accuracy/accuracy.html',
        controllerAs: 'accuracy',
        controller: function($scope, $reactive, $state, $stateParams) {

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
             * Listen for the throwEvent. Is being emitted by dartboard or keyboard tracker
             */
            $scope.$on("positionEvent", function (event, data) {
                $scope.hits.push(data);
                $scope.$apply();
            });

            /**
             * Starts server side calculation
             */
            $scope.calculate = () => {

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
            $scope.enoughDartsThrown = () => {
                return $scope.hits.length > 5;
            };
        }
    }
});