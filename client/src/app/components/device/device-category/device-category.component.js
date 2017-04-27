(function () {
  angular
    .module('app')
    .component('deviceCategoryComponent', {
      templateUrl: 'app/components/device/device-category/device-category.component.html',
      controller: deviceCategoryComponent,
      controllerAs: 'vm'
    });

  /** @ngInject */
  function deviceCategoryComponent($stateParams, Documents, Fields, $uibModal, Category) {
    var vm = this;
    vm.$onInit = function () {
      vm.deviceId = $stateParams.id;
      vm.categoryId = $stateParams.categoryId;
      vm.loadDocuments();
      Category.getCategory($stateParams.categoryId)
        .then(function (response) {
          vm.category = response.data;
        });
      Fields.getFields($stateParams.categoryId)
        .then(function (response) {
          vm.fields = response.data;
        })
    };
    vm.loadDocuments = function () {
      Documents.getAll($stateParams.id, $stateParams.categoryId)
        .then(function (response) {
          vm.documents = response.data;
        });
    };
    vm.openDocumentModal = function (document) {
      if (!document._id) {
        document.category = $stateParams.categoryId;
        document.product = $stateParams.id;
        document.fields = vm.fields.map(function (item) {
          return {
            field: item
          }
        });
      }
      var modalInstance = $uibModal.open({
        animation: true,
        component: 'documentCreateComponent',
        resolve: {
          document: function () {
            return angular.copy(document);
          }
        }
      });

      modalInstance.result.then(function () {
        vm.loadDocuments();
      });
    };
    vm.delete = function (document) {
      $uibModal.open({
        animation: true,
        component: 'confirmComponent',
        size: 'sm',
        resolve: {
          message: function () {
            return 'Are you sure to delete this document?';
          }
        }
      }).result.then(function () {
        Documents.deleteDocument(document)
          .then(function () {
            vm.loadDocuments();
          })
          .catch(function () {
            toastr.error('Something went wrong', 'Error');
          })
      });
    }
  }

})();
