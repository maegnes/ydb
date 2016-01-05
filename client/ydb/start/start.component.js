angular.module('ydb').directive('start', function() {
    return {
        restrict: 'E',
        templateUrl: 'client/ydb/start/start.html',
        controllerAs: 'start',
        controller: function($scope, $reactive) {
            $reactive(this).attach($scope);
        }
    }
});