(function () {
  angular
    .module('app')
    .component('deviceSerialNumbersComponent', {
      templateUrl: 'app/components/device/device-category/device-serial-numbers/device-serial-numbers-component.html',
      controller: deviceSerialNumbersComponent,
      controllerAs: 'vm'
    });

  /** @ngInject */
  function deviceSerialNumbersComponent($stateParams, Sales, toastr, $uibModal, localStorageService, $scope, $httpParamSerializer, StaticFields) {
    var vm = this;
    vm.$onInit = function () {
      vm.model = 'Sale';
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
      if ($stateParams.serialNumber) {
        vm.searchFilters.serialNumber = $stateParams.serialNumber;
      }
      $scope.$watch('vm.searchFilters', function () {
        vm.loadSales();
      }, true);
      StaticFields.getFields(vm.model)
        .then(function (response) {
          vm.fields = response.data;
        })
        .catch(function () {
          toastr.error('Something went wrong', 'Error');
        });

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
      if (vm.sortFilters.sort === key) {
        vm.sortFilters.order = !vm.sortFilters.order;
      } else {
        vm.sortFilters.sort = key;
        vm.sortFilters.order = true;
      }
      localStorageService.set('salesSortFilters', vm.sortFilters);
      vm.loadSales();
    };
    vm.openCreateModal = function (sale) {
      if (!sale._id) {
        sale.product = $stateParams.id;
        sale.fields = vm.fields.map(function (item) {
          return {
            field: item
          }
        });
      }
      var modalInstance = $uibModal.open({
        animation: true,
        component: 'createSaleComponent',
        resolve: {
          sale: function () {
            return angular.copy(sale);
          }
        }
      });

      modalInstance.result.then(function () {
        vm.loadSales();
      });
    };
    vm.openImportModal = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        component: 'importComponent',
        size: 'lg',
        resolve: {
          headers: function () {
            return [
              {
                key: 'serialNumber',
                type: 'text',
                required: true
              },
              {
                key: 'version',
                type: 'text',
                required: true
              },
              {
                key: 'salesOrder',
                type: 'text',
                required: false
              },
              {
                key: 'date',
                type: 'date',
                required: false
              }
            ];
          },
          save: function () {
            return function (data) {
              data.forEach(function (sale) {
                sale.product = $stateParams.id;
                sale.fields = vm.fields.map(function (item) {
                  return {
                    field: item
                  }
                });
              });
              return Sales.createCollection(data)
                .catch(function () {
                  toastr.error('Something went wrong', 'Error');
                });
            }
          },
          parser: function () {
            return function (data) {
              data.forEach(function (item) {
                item.date = +item.date ? new Date(1900, 0, +item.date - 1) : null;
              });
            }
          }
        }
      });

      modalInstance.result.then(function () {
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
          });
      });
    };
    function applyByFilters(sale) {
      return true;
    }
  }
})();
