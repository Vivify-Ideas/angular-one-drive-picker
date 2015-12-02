/*
 * angular-one-drive-picker
 *
 * Interact with the OneDrive API Picker
 * More information about the OneDrive API can be found at https://dev.onedrive.com/sdk/javascript-picker-saver.htm
 *
 * (c) 2015 Vivify Ideas
 * License: MIT
 */
(function () {
  angular.module('angularOneDrivePicker', [])

  .provider('angularOneDriveSettings', function () {
    this.client_id     = null;
    this.redirect_uri  = null;
    this.select        = 'multi';

    /**
     * Provider factory $get method
     * Return OneDrive Picker API settings
     */
    this.$get = ['$window', function ($window) {
      return {
        client_id     : this.client_id,
        redirect_uri  : this.redirect_uri,
        select        : this.select
      }
    }];

    /**
     * Set the API config params using a hash
     */
    this.configure = function (config) {
      for (var key in config) {
        this[key] = config[key];
      }
    };
  })

  .directive('angularOneDrivePicker', ['angularOneDriveSettings', function (angularOneDriveSettings) {
    return {
      restrict: 'A',
      scope: {
        afterSelect: '='
      },
      link: function (scope, element, attrs) {

        WL.init(angularOneDriveSettings);

        function openFileDialog() {
          WL.login({ scope: 'wl.signin onedrive.readonly' })
          .then(function(response) {
            openFromSkyDrive();
          });
        }

        function openFromSkyDrive() {
          WL.fileDialog({
            mode: 'open',
            select: angularOneDriveSettings.select
          }).then(function(response) {
            scope.afterSelect(response.data.files);
            scope.$apply();
          });
        }

        element.bind('click', function (e) {
          openFileDialog();
        });
      }
    }
  }]);
})();