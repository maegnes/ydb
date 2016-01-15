angular.module('ydb').directive('keyboard', function() {
    return {
        restrict: 'E',
        templateUrl: 'client/ydb/internal/game/keyboard/keyboard.html',
        controllerAs: 'keyboard',
        controller: function($scope, $reactive, $state, $stateParams) {

            $reactive(this).attach($scope);

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
             * User clicked double
             */
            this.clickDouble = () => {
                this.isDouble = !this.isDouble;
                this.isTriple = false;
            };

            /**
             * User clicked triple
             */
            this.clickTriple = () => {
                this.isTriple = !this.isTriple;
                this.isDouble = false;
            };

            /**
             * User clicked on a score field. broadcast the throw to the application
             *
             * @param score
             */
            this.clickScore = (score) => {
                score = this.getScore(score);
                this.isTriple = false;
                this.isDouble = false;
                $scope.$broadcast("throwEvent", score);
            };

            /**
             * Calculate the score and create score object
             *
             * @param score
             * @returns {{score: number, fieldName: string, fieldType: string}}
             */
            this.getScore = (score) => {
                let returnScore = score * ((this.isTriple) ? 3 : (this.isDouble ? 2 : 1));
                let fieldType = ((this.isTriple) ? 'T' : (this.isDouble ? 'D' : (0 == score ? 'N' : 'S')));
                let fieldName = (fieldType == 'N') ? 'No Score' : fieldType + score;
                return {
                    score: returnScore,
                    fieldName: fieldName,
                    fieldType: fieldType
                };
            };

        }
    }
});