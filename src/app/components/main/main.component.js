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
  }
})();
