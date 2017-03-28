(function () {
  angular
    .module('app')
    .component('createFieldComponent', {
      templateUrl: 'app/components/fields/create/create.field.component.html',
      bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
      },
      controller: createFieldComponent,
      controllerAs: 'vm'
    });

  /** @ngInject */
  function createFieldComponent(Fields, toastr) {
    var vm = this;
    vm.$onInit = function () {
      vm.field = vm.resolve.field;
      Fields.loadTypes()
        .then(function (response) {
          vm.types = response.data;
        })
        .catch(function () {
          toastr.error('Error on load types', 'Error');
        })
    };
    vm.cancel = function () {
      vm.dismiss({$value: 'cancel'});
    };
    vm.save = function () {
      vm.loadInProgress = true;
      if(vm.field._id){
        Fields.updateField(vm.field)
          .then(function () {
            vm.close({$value: vm.field});
          })
          .catch(function (error) {
            var message;
            if (error.data && error.data.message) {
              message = error.data.message;
            } else {
              message = 'Something went wrong';
            }
            toastr.error(message, 'Error');
          })
          .finally(function () {
            vm.loadInProgress = false;
          });
      } else {
        Fields.createField(vm.field)
          .then(function (response) {
            vm.close({$value: response.data});
          })
          .catch(function (error) {
            var message;
            if (error.data && error.data.message) {
              message = error.data.message;
            } else {
              message = 'Something went wrong';
            }
            toastr.error(message, 'Error');
          })
          .finally(function () {
            vm.loadInProgress = false;
          });
      }
    }
  }
})();
