(function () {
  angular
    .module('app')
    .component('serialsListComponent', {
      templateUrl: 'app/components/serials/serials-list/serials-list.component.html',
      controller: serialsListComponent,
      controllerAs: 'vm',
      bindings: {
        serials: '<',
        delete: '&',
        sortFilters: '<',
        onSortFiltersChanged: '&'
      }
    });

  /** @ngInject */
  function serialsListComponent() {
    var vm = this;

  }
})();
