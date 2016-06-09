/**
 * Directive for the alternative keypad score tracker
 */
angular.module('ydb').directive('keypad', function() {
    return {
        restrict: 'E',
        templateUrl: 'client/ydb/internal/game/keypad/keypad.html',
        controllerAs: 'keypad',
        controller: function($scope, $stateParams) {

            /**
             * Is the double button active?
             *
             * @type {boolean}
             */
            this.isDouble = false;

            /**
             * Is the triple button active?
             *
             * @type {boolean}
             */
            this.isTriple = false;

            /**
             * Check if its a cricket game
             */
            this.isCricket = function() {
                return ('cricket' == $stateParams.type);
            };

            /**
             * User clicked double
             */
            this.clickDouble = function() {
                this.isDouble = !this.isDouble;
                this.isTriple = false;
            };

            /**
             * User clicked triple
             */
            this.clickTriple = function() {
                this.isTriple = !this.isTriple;
                this.isDouble = false;
            };

            /**
             * User clicked on a score field. broadcast the throw to the application
             *
             * @param score
             */
            this.clickScore = function(score) {
                score = this.getScore(score);
                this.isTriple = false;
                this.isDouble = false;
                // Emit a throwEvent. Being watched inside the game component to send scores to the server
                $scope.$parent.$broadcast("throwEvent", score);
            };

            /**
             * Calculate the score and create score object
             *
             * @param score
             * @returns {{score: number, fieldName: string, fieldType: string}}
             */
            this.getScore = function(score) {
                let multiplier = ((this.isTriple) ? 3 : (this.isDouble ? 2 : 1));
                let returnScore = score * multiplier;
                let fieldType = ((this.isTriple) ? 'T' : (this.isDouble ? 'D' : (0 == score ? 'N' : 'S')));
                let fieldName = (fieldType == 'N') ? 'No Score' : fieldType + score;
                return {
                    field: score,
                    multiplier: multiplier,
                    score: returnScore,
                    fieldName: fieldName,
                    fieldType: fieldType
                };
            };
        }
    }
});