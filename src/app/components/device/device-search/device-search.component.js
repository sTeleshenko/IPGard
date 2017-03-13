(function () {
  angular
    .module('app')
    .component('deviceSearchComponent', {
      templateUrl: 'app/components/device/device-search/device-search.component.html',
      bindings: {
        onFiltersChanged: '&',
        filters: '<',
        openDeviceModal: '&',
        mode: '<'
      },
      controller: DeviceSearchController,
      controllerAs: 'vm'
    });

  /** @ngInject */
  function DeviceSearchController($httpParamSerializer, Device) {
    var vm = this;

    vm.$onInit = function() {
      if(vm.mode === 'sales') {
        vm.getDevices();
      }
    }

    vm.reset = function () {
      vm.filters = {};
      vm.search();
    };
    vm.search = function () {
      vm.onFiltersChanged({
        filters: vm.filters
      });
    };

    vm.getDevices = function () {
      var query = '?' +  $httpParamSerializer({
          limit: 1000000,
          page: 1
        });
      Device
        .getAll(query)
        .then(function (response) {
          vm.devices =  response.data.docs;
        })
    }
  }
})();
