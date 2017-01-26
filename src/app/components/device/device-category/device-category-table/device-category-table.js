(function () {
  angular
    .module('app')
    .component('deviceCategoryTable', {
      templateUrl: 'app/components/device/device-category/device-category-table/device-category-table.html',
      controller: deviceCategoryTable,
      controllerAs: 'vm',
      bindings: {
        documents: '<',
        fields: '<',
        openDocumentModal: '&',
        delete: '&'
      }
    });

  /** @ngInject */
  function deviceCategoryTable() {
    var vm = this;

  }
})();
