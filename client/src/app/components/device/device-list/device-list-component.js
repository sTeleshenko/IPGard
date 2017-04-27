(function () {
  angular
    .module('app')
    .component('deviceListComponent', {
      templateUrl: 'app/components/device/device-list/device-list-component.html',
      controller: deviceListComponent,
      controllerAs: 'vm',
      bindings: {
        devices: '<',
        openDeviceModal: '&',
        delete: '&',
        sortFilters: '<',
        onSortFiltersChanged: '&'
      }
    });

  /** @ngInject */
  function deviceListComponent() {
    var vm = this;

  }
})();
