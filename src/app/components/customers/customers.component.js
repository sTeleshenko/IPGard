(function () {
  angular
    .module('app')
    .component('customersComponent', {
      templateUrl: 'app/components/customers/customers.component.html',
      controller: customersComponent,
      controllerAs: 'vm'
    });

  /** @ngInject */
  function customersComponent(Customers, toastr, localStorageService, $uibModal, $scope, StaticFields) {
    var vm = this;
    vm.$onInit = function () {
      vm.model = 'Customer';
      vm.fields = StaticFields.static[vm.model];
      vm.customers = [];
      vm.sortFilters = localStorageService.get('customersSortFilters') || {
          sort: 'name',
          order: true
        };
      vm.limits = [10, 20, 50, 100];
      vm.pagination = {
        total: 0,
        page: 1,
        limit: localStorageService.get('paginationLimit') || 10
      };
      vm.filters = localStorageService.get('customersFilters') || {};
      vm.dynamicFields = [];
      StaticFields.getFields(vm.model)
        .then(function (response) {
          vm.dynamicFields = response.data;
        })
        .catch(function () {
          toastr.error('Something went wrong', 'Error');
        });
      // $scope.$watch('vm.filters', function () {
      //   vm.loadCustomers();
      // }, true);
      vm.loadCustomers()
    };

    vm.loadCustomers = function () {
      var query = '?';
      for(var key in vm.filters) {
        if(vm.filters[key]){
          query = query + key + '=' + vm.filters[key] + '&'
        }
      }
      query = query + 'sort=' + (vm.sortFilters.order ? '' : '-') + vm.sortFilters.sort + '&';
      query = query + 'page=' + vm.pagination.page + '&';
      query = query + 'limit=' + vm.pagination.limit;
      Customers.getAll(query)
        .then(function (response) {
          vm.customers = response.data.docs;
          vm.pagination.total = response.data.total;
          vm.pagination.page = response.data.page;
        })
        .catch(function () {
          toastr.error('Something went wrong', 'Error');
        });
    };

    vm.openCustomerModal = function (customer) {
      if(!customer._id){
        customer.fields = vm.dynamicFields.map(function (item) {
          return {
            field: item
          }
        });
      }
      var modalInstance = $uibModal.open({
        animation: true,
        component: 'createCustomerComponent',
        resolve: {
          customer: function () {
            return angular.copy(customer);
          }
        }
      });

      modalInstance.result.then(function () {
        vm.loadCustomers();
      });
    };
    vm.openImportModal = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        component: 'importComponent',
        size: 'lg',
        resolve: {
          headers: function () {
            return vm.fields;
          },
          save: function () {
            return function (data) {
              // data.forEach(function (sale) {
              //   sale.product = $stateParams.id;
              //   sale.fields = vm.fields.map(function (item) {
              //     return {
              //       field: item
              //     }
              //   });
              // });
              return Customers.createCollection(data)
                .catch(function () {
                  toastr.error('Something went wrong', 'Error');
                });
            }
          }
        }
      });

      modalInstance.result.finally(function () {
        vm.loadCustomers();
      });
    };

    vm.delete = function (customer) {
      $uibModal.open({
        animation: true,
        component: 'confirmComponent',
        size: 'sm',
        resolve: {
          message: function () {
            return 'Are you sure to delete customer ' + customer.name + '?';
          }
        }
      }).result.then(function () {
        Customers.delete(customer)
          .then(function () {
            vm.loadCustomers();
          })
          .catch(function () {
            toastr.error('Something went wrong', 'Error');
          })
      });
    };

    vm.onLimitChange = function () {
      localStorageService.set('paginationLimit', vm.pagination.limit);
      vm.loadCustomers();
    };

    vm.onFiltersChanged  = function (filters) {
      localStorageService.set('customersFilters', filters);
      vm.filters = filters;
      vm.loadCustomers();
    };

    vm.onSortFiltersChanged = function (key) {
      if(vm.sortFilters.sort === key){
        vm.sortFilters.order = !vm.sortFilters.order;
      } else {
        vm.sortFilters.sort = key;
        vm.sortFilters.order = true;
      }
      localStorageService.set('customersSortFilters', vm.sortFilters);
      vm.loadCustomers();
    };

    vm.reset = function () {
      vm.filters = {};
      vm.loadCustomers();
    };

  }
})();
