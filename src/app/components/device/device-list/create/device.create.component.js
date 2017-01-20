(function () {
  angular
    .module('app')
    .component('createDeviceComponent', {
      templateUrl: 'app/components/device/device-list/create/device.create.component.html',
      bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
      },
      controller: createDeviceComponent,
      controllerAs: 'vm'
    });

  /** @ngInject */
  function createDeviceComponent(Device, toastr) {
    var vm = this;
    vm.$onInit = function () {
      vm.device = vm.resolve.device;
    };
    vm.cancel = function () {
      vm.dismiss({$value: 'cancel'});
    };
    vm.save = function () {
      if(vm.device._id){
        Device.updateDevice(vm.device)
          .then(function () {
            vm.close({$value: vm.device});
          })
          .catch(function (error) {
            var message;
            if (error.data && error.data.message) {
              message = error.data.message;
            } else {
              message = 'Something went wrong';
            }
            toastr.error(message, 'Error');
          });
      } else {
        Device.createDevice(vm.device)
          .then(function (response) {
            vm.close({$value: response.data});
          })
          .catch(function (error) {
            var message;
            if (error.data && error.data.message) {
              message = error.data.message;
            } else {
              message = 'Something went wrong';
            }
            toastr.error(message, 'Error');
          });
      }
    }
  }
})();
