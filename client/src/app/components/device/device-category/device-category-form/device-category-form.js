(function () {
  angular
    .module('app')
    .component('deviceCategoryForm', {
      templateUrl: 'app/components/device/device-category/device-category-form/device-category-form.html',
      controller: deviceCategoryForm,
      controllerAs: 'vm',
      bindings: {
        documents: '<',
        openDocumentModal: '&',
        delete: '&'
      }
    });

  /** @ngInject */
  function deviceCategoryForm() {
    var vm = this;

  }
})();
