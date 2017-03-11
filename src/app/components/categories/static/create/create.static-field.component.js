(function () {
  angular
    .module('app')
    .component('createStaticFieldComponent', {
      templateUrl: 'app/components/categories/static/create/create.static-field.component.html',
      bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
      },
      controller: createStaticFieldComponent,
      controllerAs: 'vm'
    });

  /** @ngInject */
  function createStaticFieldComponent(StaticFields, toastr) {
    var vm = this;
    vm.$onInit = function () {
      vm.field = vm.resolve.field;
      StaticFields.loadTypes()
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
      if(vm.field._id){
        StaticFields.updateField(vm.field)
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
          });
      } else {
        StaticFields.createField(vm.field)
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
          });
      }
    }
  }
})();
