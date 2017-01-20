(function () {
  angular
    .module('app')
    .component('createCategoryComponent', {
      templateUrl: 'app/components/categories/create/create.category.component.html',
      bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
      },
      controller: createCategoryComponent,
      controllerAs: 'vm'
    });

  /** @ngInject */
  function createCategoryComponent(Category, toastr) {
    var vm = this;
    vm.$onInit = function () {
      vm.category = vm.resolve.category;
    };
    vm.cancel = function () {
      vm.dismiss({$value: 'cancel'});
    };
    vm.save = function () {
      if(vm.category._id){
        Category.updateCategory(vm.category)
          .then(function () {
            vm.close({$value: vm.category});
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
        Category.createCategory(vm.category)
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
