(function () {
  angular
    .module('app')
    .component('aboutComponent', {
      templateUrl: 'app/components/about/about-component.html',
      controller: aboutComponent,
      controllerAs: 'vm'
    });

  /** @ngInject */
  function aboutComponent() {
    var vm = this;
    vm.$onInit = function () {
      vm.headers = ['serialNumber', 'version'];
      vm.data = [];
    }
  }
})();
