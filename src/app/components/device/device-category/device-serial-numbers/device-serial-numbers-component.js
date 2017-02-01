(function () {
  angular
    .module('app')
    .component('deviceSerialNumbersComponent', {
      templateUrl: 'app/components/device/device-category/device-serial-numbers/device-serial-numbers-component.html',
      controller: deviceSerialNumbersComponent,
      controllerAs: 'vm'
    });

  /** @ngInject */
  function deviceSerialNumbersComponent($stateParams, Sales, toastr, $uibModal) {
    var vm = this;
    vm.$onInit = function () {
      vm.loadSales();
    };
    vm.loadSales = function () {
      var query = '?';
      query = query + 'product=' + $stateParams.id;
      // for(var key in vm.filters) {
      //   if (vm.filters[key]) {
      //     query = query + key + '=' + vm.filters[key] + '&'
      //   }
      // }
      Sales.getAll(query)
        .then(function (response) {
          vm.sales = response.data.docs;
        })
        .catch(function () {
          toastr.error('Something went wrong', 'Error');
        });

    };
    vm.openCreateModal = function (sale, index) {
      sale.product = $stateParams.id;
      var modalInstance = $uibModal.open({
        animation: true,
        component: 'createSaleComponent',
        resolve: {
          sale: function () {
            return angular.copy(sale);
          }
        }
      });

      modalInstance.result.then(function (result) {
        // // vm.selected = selectedItem;
        // console.log(result)
        if(sale._id === result._id) {
          vm.sales[index] = result;
        } else if (applyByFilters(result)){
          vm.sales.push(result);
        }
      });
    };
    vm.delete = function (sale, index) {
      $uibModal.open({
        animation: true,
        component: 'confirmComponent',
        size: 'sm',
        resolve: {
          message: function () {
            return 'Are you sure to delete this sale?';
          }
        }
      }).result.then(function () {
        Sales.deleteSale(sale)
          .then(function () {
            vm.sales.splice(index, 1);
          })
          .catch(function () {
            toastr.error('Something went wrong', 'Error');
          })
      });
    };
    function applyByFilters(sale) {
      return true;
    }
  }
})();
