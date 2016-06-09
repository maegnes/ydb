/**
 * Directive for the settings modal
 */
angular.module('ydb').directive('settings', function () {
    return {
        restrict: 'E',
        templateUrl: 'client/ydb/internal/settings/settings.html',
        controllerAs: 'settings',
        controller: function () {

            /**
             * Get the current profile from the user object
             *
             * @type {*|profile|any|{scoreTracking}|Object|string}
             */
            this.profile = Meteor.user().profile;

            /**
             * Save the new user profile
             */
            this.save = function() {
                Meteor.users.update(
                    {
                        _id: Meteor.userId()
                    },
                    {
                        $set: {
                            "profile": this.profile
                        }
                    }
                );
                // Hide the settings modal
                $('#settingsModal').modal('hide');
            }
        }
    }
});