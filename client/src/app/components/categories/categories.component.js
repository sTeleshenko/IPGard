(function () {
  angular
    .module('app')
    .component('categoriesComponent', {
      templateUrl: 'app/components/categories/categories.component.html',
      controller: categoriesComponent,
      controllerAs: 'vm'
    });

  /** @ngInject */
  function categoriesComponent(Category, toastr, $uibModal) {
    var vm = this;
    vm.$onInit = function () {
      Category.getCategories()
        .then(function (response) {
          vm.categories = response.data;
        })
        .catch(function () {
          toastr.error('Error on load categories', 'Error');
        })
    };
    vm.openCategoryModal = function (category, index) {
      var modalInstance = $uibModal.open({
        animation: true,
        component: 'createCategoryComponent',
        resolve: {
          category: function () {
            return angular.copy(category);
          }
        }
      });

      modalInstance.result.then(function (result) {
        // // vm.selected = selectedItem;
        // console.log(result)
        if(category._id === result._id) {
          vm.categories[index] = result;
        } else {
          vm.categories.push(result);
        }
      });
    };
    vm.delete = function (category, index) {
      $uibModal.open({
        animation: true,
        component: 'confirmComponent',
        size: 'sm',
        resolve: {
          message: function () {
            return 'Are you sure to delete category ' + category.title + '?';
          }
        }
      }).result.then(function () {
        Category.deleteCategory(category)
          .then(function () {
            vm.categories.splice(index, 1);
          })
          .catch(function () {
            toastr.error('Something went wrong', 'Error');
          })
      });
    }
  }
})();
