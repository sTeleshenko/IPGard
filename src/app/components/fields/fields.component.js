(function () {
  angular
    .module('app')
    .component('fieldsComponent', {
      templateUrl: 'app/components/fields/fields.component.html',
      controller: fieldsComponent,
      controllerAs: 'vm'
    });

  /** @ngInject */
  function fieldsComponent(Fields, $stateParams, $uibModal, Category, $state, toastr) {
    var vm = this;
    vm.$onInit = function () {
      Category.getCategory($stateParams.id)
        .then(function (response) {
          vm.category = response.data;
        })
        .catch(function () {
          toastr.error('Something went wrong', 'Error');
          $state.go('categories');
        });

      Fields.getFields($stateParams.id)
        .then(function (response) {
          vm.fields = response.data;
        })
        .catch(function () {
          toastr.error('Something went wrong', 'Error');
        });
    };
    vm.openFieldModal = function (field, index) {
      if(!field.category) field.category = $stateParams.id;
      field.required = !!field.required;
      var modalInstance = $uibModal.open({
        animation: true,
        component: 'createFieldComponent',
        resolve: {
          field: function () {
            return angular.copy(field);
          }
        }
      });

      modalInstance.result.then(function (result) {
        if(field._id === result._id) {
          vm.fields[index] = result;
        } else {
          vm.fields.push(result);
        }
      });
    };
    vm.delete = function (field, index) {
      $uibModal.open({
        animation: true,
        component: 'confirmComponent',
        size: 'sm',
        resolve: {
          message: function () {
            return 'Are you sure to delete field ' + field.title + '?';
          }
        }
      }).result.then(function () {
        Fields.deleteField(field)
          .then(function () {
            vm.fields.splice(index, 1);
          })
          .catch(function () {
            toastr.error('Something went wrong', 'Error');
          })
      });
    }
  }
})();
