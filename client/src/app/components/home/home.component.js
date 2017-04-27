(function () {
  angular
    .module('app')
    .component('homeComponent', {
      templateUrl: 'app/components/home/home.component.html',
      controller: HomeController,
      controllerAs: 'vm'
    });

  /** @ngInject */
  function HomeController(localStorageService, Device, toastr, $uibModal) {
    var vm = this;

    vm.$onInit = function () {
      // Device.generate();
      vm.devices = [];
      vm.sortFilters = localStorageService.get('deviceSortFilters') || {
        sort: 'model',
        order: true
      };
      vm.limits = [10, 20, 50, 100];
      vm.pagination = {
        page: 1,
        limit: localStorageService.get('paginationLimit') || 10
      };
      vm.filters = localStorageService.get('deviceFilters') || {};
      vm.loadDevices();
    };

    vm.onLimitChange = function () {
      localStorageService.set('paginationLimit', vm.pagination.limit);
      vm.loadDevices();
    };

    vm.onFiltersChanged  = function (filters) {
      localStorageService.set('deviceFilters', filters);
      vm.filters = filters;
      vm.loadDevices();
    };

    vm.onSortFiltersChanged = function (key) {
      if(vm.sortFilters.sort === key){
        vm.sortFilters.order = !vm.sortFilters.order;
      } else {
        vm.sortFilters.sort = key;
        vm.sortFilters.order = true;
      }
      localStorageService.set('deviceSortFilters', vm.sortFilters);
      vm.loadDevices();
    };

    vm.loadDevices = function () {
      var query = '?';
      for(var key in vm.filters) {
        if(vm.filters[key]){
          query = query + key + '=' + vm.filters[key] + '&'
        }
      }
      query = query + 'sort=' + (vm.sortFilters.order ? '' : '-') + vm.sortFilters.sort + '&';
      query = query + 'page=' + vm.pagination.page + '&';
      query = query + 'limit=' + vm.pagination.limit;
      Device.getAll(query)
        .then(function (response) {
          vm.devices = response.data.docs;
          vm.pagination.total = response.data.total;
          vm.pagination.page = response.data.page;
        })
        .catch(function () {
          toastr.error('Something went wrong', 'Error');
        });
    };

    vm.openDeviceModal = function (device, index) {
      var modalInstance = $uibModal.open({
        animation: true,
        component: 'createDeviceComponent',
        resolve: {
          device: function () {
            return angular.copy(device);
          }
        }
      });

      modalInstance.result.then(function (result) {
        // if(device._id === result._id) {
        //   vm.devices[index] = result;
        // } else if (applyByFilters(result)){
        //   vm.devices.push(result);
        // }
        vm.loadDevices();
      });
    };
    vm.delete = function (device, index) {
      $uibModal.open({
        animation: true,
        component: 'confirmComponent',
        size: 'sm',
        resolve: {
          message: function () {
            return 'Are you sure to delete device ' + device.model + '?';
          }
        }
      }).result.then(function () {
        Device.deleteDevice(device)
          .then(function () {
            // vm.devices.splice(index, 1);
            vm.loadDevices();
          })
          .catch(function () {
            toastr.error('Something went wrong', 'Error');
          })
      });
    };
    // function applyByFilters(device) {
    //   var apply = true;
    //   for (var key in vm.filters) {
    //     if(vm.filters[key].length && device[key].indexOf(vm.filters[key]) === -1) {
    //       apply = false;
    //       break;
    //     }
    //   }
    //   return apply;
    // }
  }
})();
