(function () {
  angular
    .module('app')
    .component('serialsComponent', {
      templateUrl: 'app/components/serials/serials.component.html',
      controller: serialsComponent,
      controllerAs: 'vm'
    });

  /** @ngInject */
  function serialsComponent(localStorageService, Sales, toastr, $uibModal, $httpParamSerializer) {
    var vm = this;
    vm.$onInit = function () {
      vm.serials = [];
      vm.sortFilters = localStorageService.get('serialsSortFilters') || {
          sort: 'product.model',
          order: true
        };
      vm.limits = [10, 20, 50, 100];
      vm.pagination = {
        page: 1,
        limit: localStorageService.get('paginationLimit') || 10
      };
      vm.filters = localStorageService.get('serialsFilters') || {};
      if(vm.filters.dateFrom) {
        vm.filters.dateFrom = new Date(vm.filters.dateFrom);
      }
      if(vm.filters.dateTo) {
        vm.filters.dateTo = new Date(vm.filters.dateTo);
      }
      vm.loadSerials();
    };
    vm.onLimitChange = function () {
      localStorageService.set('paginationLimit', vm.pagination.limit);
      vm.loadSerials();
    };

    vm.loadSerials = function () {
      var query = '?';
      var filtersCopy = angular.copy(vm.filters);
      if(filtersCopy.product) {
        filtersCopy.product = filtersCopy.product._id;
      }
      query += $httpParamSerializer(filtersCopy) + '&';
      // for(var key in vm.filters) {
      //   if(vm.filters[key]){
      //     query = query + key + '=' + vm.filters[key] + '&'
      //   }
      // }
      query = query + 'sort=' + (vm.sortFilters.order ? '' : '-') + vm.sortFilters.sort + '&';
      query = query + 'page=' + vm.pagination.page + '&';
      query = query + 'limit=' + vm.pagination.limit;
      Sales.getAll(query)
        .then(function (response) {
          vm.serials = response.data.docs;
          vm.pagination.total = response.data.total;
          vm.pagination.page = response.data.page;
        })
        .catch(function () {
          toastr.error('Something went wrong', 'Error');
        });
    };

    vm.onSortFiltersChanged = function (key) {
      if(vm.sortFilters.sort === key){
        vm.sortFilters.order = !vm.sortFilters.order;
      } else {
        vm.sortFilters.sort = key;
        vm.sortFilters.order = true;
      }
      localStorageService.set('serialsSortFilters', vm.sortFilters);
      vm.loadSerials();
    };

    vm.onFiltersChanged  = function (filters) {
      localStorageService.set('serialsFilters', filters);
      vm.filters = filters;
      vm.loadSerials();
    };

    vm.delete = function (serial) {
      $uibModal.open({
        animation: true,
        component: 'confirmComponent',
        size: 'sm',
        resolve: {
          message: function () {
            return 'Are you sure to delete serial number ' + serial.serialNumber + '?';
          }
        }
      }).result.then(function () {
        Sales.deleteSale(serial)
          .then(function () {
            vm.loadSerials();
          })
          .catch(function () {
            toastr.error('Something went wrong', 'Error');
          })
      });
    };

  }

})();
