(function () {
  angular
    .module('app')
    .component('deviceSubcategories', {
      templateUrl: 'app/components/device/device-category/device-subcategories/device-subcategories.html',
      controller: deviceSubcategories,
      controllerAs: 'vm',
      bindings: {
        documents: '<',
        deviceId: '<',
        category: '<',
        fields: '<',
        delete: '&',
        openDocumentModal: '&'
      }
    });

  /** @ngInject */
  function deviceSubcategories(Documents, toastr, $scope) {
    var vm = this;
    vm.$onInit = function () {
      Documents.getAll(vm.deviceId, vm.category.relatedCategory)
        .then(function (response) {
          vm.subcategories = [];
          response.data.forEach(function (document) {
            for(var i = 0; i < document.fields.length; i++){
              if(document.fields[i].field._id === vm.category.subcategoryField){
                vm.subcategories.push(document.fields[i]);
                break;
              }
            }
          });
          vm.filterDocuments();
        })
        .catch(function () {
          toastr.error('Error on load subcategories', 'Error');
        });
      $scope.$watchCollection('vm.documents', vm.filterDocuments);
    };

    vm.onDelelte = function (document) {
      vm.delete({
        document: document
      });
    };

    vm.create = function (document) {
      vm.openDocumentModal({
        document: document
      });
    };

    vm.onCreateClick = function (sub, ev) {
      ev.preventDefault();
      ev.stopPropagation();
      vm.create({
        subcategoryField: sub._id
      });
    };

    vm.filterDocuments = function () {
      if(vm.subcategories.length && vm.documents) {
        vm.subcategories.forEach(function (sub) {
          sub.documents = [];
          vm.documents.forEach(function (doc) {
            if(doc.subcategoryField === sub._id) {
              sub.documents.push(doc);
            }
          })
        })
      }
    }

  }
})();
