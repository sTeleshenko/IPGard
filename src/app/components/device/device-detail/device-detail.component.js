(function () {
  angular
    .module('app')
    .component('deviceDetailComponent', {
      templateUrl: 'app/components/device/device-detail/device-detail.component.html',
      controller: deviceDetailComponent,
      controllerAs: 'vm'
    });

  /** @ngInject */
  function deviceDetailComponent($stateParams, Category, Device, toastr) {
    var vm = this;
    vm.$onInit = function () {
      Category.getCategories()
        .then(function (response) {
          vm.categories = response.data;
        })
        .catch(function () {
          toastr.error('Error on load categories', 'Error');
        });
      Device.getDevice($stateParams.id)
        .then(function (response) {
          vm.device = response.data;
        })
        .catch(function () {
          toastr.error('Error on load this device', 'Error');
        })
    }
  }
})();
