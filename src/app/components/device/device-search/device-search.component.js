(function () {
  angular
    .module('app')
    .component('deviceSearchComponent', {
      templateUrl: 'app/components/device/device-search/device-search.component.html',
      bindings: {
        onFiltersChanged: '&',
        filters: '<',
        openDeviceModal: '&'
      },
      controller: DeviceSearchController,
      controllerAs: 'vm'
    });

  /** @ngInject */
  function DeviceSearchController() {
    var vm = this;
    vm.reset = function () {
      vm.filters = {};
      vm.search();
    };
    vm.search = function () {
      vm.onFiltersChanged({
        filters: vm.filters
      });
    }
  }
})();
