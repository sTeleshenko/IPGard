(function () {
  angular
    .module('app')
    .component('deviceSerialNumbersComponent', {
      templateUrl: 'app/components/device/device-category/device-serial-numbers/device-serial-numbers-component.html',
      controller: deviceSerialNumbersComponent,
      controllerAs: 'vm'
    });

  /** @ngInject */
  function deviceSerialNumbersComponent($stateParams, Sales, toastr, $uibModal, localStorageService, $scope, $httpParamSerializer) {
    var vm = this;
    vm.$onInit = function () {
      vm.modelOptions = {
        debounce: 300
      };
      vm.pagination = {
        page: 1,
        limit: 10,
        total: 0
      };
      vm.sortFilters = localStorageService.get('salesSortFilters') || {
          sort: 'salesOrder',
          order: true
        };
      vm.searchFilters = {};
      $scope.$watch('vm.searchFilters', function () {
        vm.loadSales();
      }, true);
      vm.loadSales();
    };
    vm.loadSales = function () {
      var query = '?product=' + $stateParams.id + '&';
      query += $httpParamSerializer(vm.searchFilters) + '&';
      query += 'sort=' + (vm.sortFilters.order ? '' : '-') + vm.sortFilters.sort + '&';
      query = query + 'page=' + vm.pagination.page + '&';
      query = query + 'limit=' + vm.pagination.limit;
      Sales.getAll(query)
        .then(function (response) {
          vm.sales = response.data.docs;
          vm.pagination.total = response.data.total;
          vm.pagination.page = response.data.page;
        })
        .catch(function () {
          toastr.error('Something went wrong', 'Error');
        });

    };

    vm.reset = function () {
      vm.searchFilters = {};
      vm.loadSales();
    };

    vm.onSortFiltersChanged = function (key) {
      if(vm.sortFilters.sort === key){
        vm.sortFilters.order = !vm.sortFilters.order;
      } else {
        vm.sortFilters.sort = key;
        vm.sortFilters.order = true;
      }
      localStorageService.set('salesSortFilters', vm.sortFilters);
      vm.loadSales();
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
        // if(sale._id === result._id) {
        //   vm.sales[index] = result;
        // } else if (applyByFilters(result)){
        //   vm.sales.push(result);
        // }
        vm.loadSales();
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
            // vm.sales.splice(index, 1);
            vm.loadSales();
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
