(function () {
  angular
    .module('app')
    .component('helpComponent', {
      templateUrl: 'app/components/help/help-component.html',
      controller: helpComponent,
      controllerAs: 'vm'
    });

  /** @ngInject */
  function helpComponent() {
    var vm = this;

  }
})();
