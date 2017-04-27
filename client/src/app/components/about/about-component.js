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

  }
})();
