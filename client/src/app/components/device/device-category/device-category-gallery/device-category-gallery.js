(function () {
  angular
    .module('app')
    .component('deviceCategoryGallery', {
      templateUrl: 'app/components/device/device-category/device-category-gallery/device-category-gallery.html',
      controller: deviceCategoryGallery,
      controllerAs: 'vm',
      bindings: {
        documents: '<',
        delete: '&'
      }
    });

  /** @ngInject */
  function deviceCategoryGallery() {
    var vm = this;

  }
})();
