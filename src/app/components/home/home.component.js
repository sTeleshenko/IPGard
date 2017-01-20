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
      vm.filters = localStorageService.get('deviceFilters') || {};
      vm.onFiltersChanged(vm.filters);
    };

    vm.onFiltersChanged  = function (filters) {
      localStorageService.set('deviceFilters', filters);
      var query = '?';
      for(var key in filters) {
        if(filters[key]){
          query = query + key + '=' + filters[key] + '&'
        }
      }
      Device.getAll(query)
        .then(function (response) {
          vm.devices = response.data;
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
        // // vm.selected = selectedItem;
        // console.log(result)
        if(device._id === result._id) {
          vm.devices[index] = result;
        } else if (applyByFilters(result)){
          vm.devices.push(result);
        }
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
            vm.devices.splice(index, 1);
          })
          .catch(function () {
            toastr.error('Something went wrong', 'Error');
          })
      });
    };
    function applyByFilters(device) {
      var apply = true;
      for (var key in vm.filters) {
        if(vm.filters[key].length && device[key].indexOf(vm.filters[key]) === -1) {
          apply = false;
          break;
        }
      }
      return apply;
    }
  }
})();
