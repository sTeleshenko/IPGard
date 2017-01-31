(function () {
  angular
    .module('app')
    .component('deviceSerialNumbersComponent', {
      templateUrl: 'app/components/device/device-category/device-serial-numbers/device-serial-numbers-component.html',
      controller: deviceSerialNumbersComponent,
      controllerAs: 'vm'
    });

  /** @ngInject */
  function deviceSerialNumbersComponent() {
    var vm = this;

  }
})();
