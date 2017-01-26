(function () {
  angular
    .module('app')
    .component('mainComponent', {
      templateUrl: 'app/components/main/main.component.html',
      controller: MainController,
      controllerAs: 'vm'
    });

  /** @ngInject */
  function MainController() {
    var vm = this;
    vm.$onInit = function () {
      vm.currentDate = new Date();
    };
  }
})();
