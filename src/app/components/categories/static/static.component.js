(function () {
  angular
    .module('app')
    .component('staticComponent', {
      templateUrl: 'app/components/categories/static/static.component.html',
      controller: staticComponent,
      controllerAs: 'vm'
    });

  /** @ngInject */
  function staticComponent(StaticFields, $stateParams, toastr, $state, $uibModal) {
    var vm = this;
    vm.$onInit = function () {
      vm.model = $stateParams.model[0].toUpperCase() + $stateParams.model.slice(1);
      vm.staticFields = StaticFields.static[vm.model];
      if (!vm.staticFields){
        toastr.error('Static table with name ' + vm.model + ' not found', 'Error');
        $state.go('categories');
      }
      StaticFields.getFields(vm.model)
        .then(function (response) {
          vm.fields = response.data;
        })
        .catch(function () {
          toastr.error('Something went wrong', 'Error');
        });
    };
    vm.openFieldModal = function (field, index) {
      if(!field.model) field.model = vm.model;
      field.required = !!field.required;
      var modalInstance = $uibModal.open({
        animation: true,
        component: 'createStaticFieldComponent',
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
        StaticFields.deleteField(field)
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
