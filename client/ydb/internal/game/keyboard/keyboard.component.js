angular.module('ydb').directive('keyboard', function() {
    return {
        restrict: 'E',
        templateUrl: 'client/ydb/internal/game/keyboard/keyboard.html',
        controllerAs: 'keyboard',
        controller: function($scope, $reactive, $state, $stateParams) {

            $reactive(this).attach($scope);

            this.isDouble = false;

            this.isTriple = false;

            this.clickDouble = () => {
                this.isDouble = !this.isDouble;
                this.isTriple = false;
            };

            this.clickTriple = () => {
                this.isTriple = !this.isTriple;
                this.isDouble = false;
            };

            this.clickScore = (score) => {
                console.log(this.getScore(score));
                this.isTriple = false;
                this.isDouble = false;
            };

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