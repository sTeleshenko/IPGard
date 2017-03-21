(function () {
  angular
    .module('app')
    .component('closeRmaComponent', {
      templateUrl: 'app/components/rma/close-modal/close-rma.component.html',
      controller: closeRmaComponent,
      controllerAs: 'vm',
      bindings: {
        close: '&',
        dismiss: '&'
      }
    });

  /** @ngInject */
  function closeRmaComponent() {
    var vm = this;
    vm.$onInit = function () {
      vm.data = {}
    };
    vm.cancel = function () {
      vm.dismiss({$value: 'cancel'});
    };
    vm.save = function () {
      vm.close({$value: vm.data})
    }
  }
})();
