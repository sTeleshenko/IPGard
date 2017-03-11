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
      Category.getCategoriesForSub()
        .then(function (response) {
          vm.relationCategories = response.data;
          if (vm.category._id && vm.category.type === 'Table with subcategory') {
            for(var i = 0; i < vm.relationCategories.length; i++){
              if(vm.relationCategories[i]._id === vm.category.relatedCategory){
                vm.category.relatedCategory = vm.relationCategories[i];
                break;
              }
            }
            for(i = 0; i < vm.category.relatedCategory.fields.length; i++){
              if(vm.category.relatedCategory.fields[i]._id === vm.category.subcategoryField){
                vm.category.subcategoryField = vm.category.relatedCategory.fields[i];
                break;
              }
            }
          }
        })
        .catch(function () {
          toastr.error('Something went wrong', 'Error');
        });

      vm.categoryType = ['Table', 'Attachments', 'Gallery', 'Table with subcategory'];
    };

    vm.clearRelatedCategory =function () {
      delete vm.category.relatedCategory;
      vm.clearRelatedField();
    };

    vm.clearRelatedField = function () {
      delete vm.category.subcategoryField;
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
