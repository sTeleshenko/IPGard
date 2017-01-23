(function () {
  angular
    .module('app')
    .component('deviceCategoryComponent', {
      templateUrl: 'app/components/device/device-category/device-category.component.html',
      controller: deviceCategoryComponent,
      controllerAs: 'vm'
    });

  /** @ngInject */
  function deviceCategoryComponent($stateParams, Documents, Fields, $uibModal) {
    var vm = this;
    vm.$onInit = function () {
      Documents.getAll($stateParams.id, $stateParams.categoryId)
        .then(function (response) {
          vm.documents = response.data;
        });
      Fields.getFields($stateParams.categoryId)
        .then(function (response) {
          vm.fields = response.data;
        })
    };
    vm.openDocumentModal = function (document, index) {
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

      modalInstance.result.then(function (result) {
        // // vm.selected = selectedItem;
        // console.log(result)
        if (document._id === result._id) {
          vm.documents[index] = result;
        } else {
          vm.documents.push(result);
        }
      });
    }
    vm.delete = function (document, index) {
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
            vm.documents.splice(index, 1);
          })
          .catch(function () {
            toastr.error('Something went wrong', 'Error');
          })
      });
    }
  }

})();
