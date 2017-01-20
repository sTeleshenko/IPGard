(function () {
  angular
    .module('app')
    .component('deviceDetailComponent', {
      templateUrl: 'app/components/device/device-detail/device-detail.component.html',
      controller: deviceDetailComponent,
      controllerAs: 'vm'
    });

  /** @ngInject */
  function deviceDetailComponent() {
    var vm = this;

  }
})();
