(function () {
  angular
    .module('app')
    .component('rmaComponent', {
      templateUrl: 'app/components/rma/rma.component.html',
      controller: rmaComponent,
      controllerAs: 'vm'
    });

  /** @ngInject */
  function rmaComponent(Rma, toastr, localStorageService, $uibModal, $httpParamSerializer) {
    var vm = this;
    vm.$onInit = function () {
      vm.rmaes = [];
      vm.sortFilters = localStorageService.get('rmaSortFilters') || {
          sort: 'formNumber',
          order: true
        };
      vm.limits = [10, 20, 50, 100];
      vm.pagination = {
        total: 0,
        page: 1,
        limit: localStorageService.get('paginationLimit') || 10
      };
      vm.filters = localStorageService.get('rmaFilters') || {};
      vm.loadRma();
    };

    vm.onLimitChange = function () {
      localStorageService.set('paginationLimit', vm.pagination.limit);
      vm.loadRma();
    };

    vm.onFiltersChanged  = function (filters) {
      localStorageService.set('rmaFilters', filters);
      vm.filters = filters;
      vm.loadRma();
    };

    vm.onSortFiltersChanged = function (key) {
      if(vm.sortFilters.sort === key){
        vm.sortFilters.order = !vm.sortFilters.order;
      } else {
        vm.sortFilters.sort = key;
        vm.sortFilters.order = true;
      }
      localStorageService.set('rmaSortFilters', vm.sortFilters);
      vm.loadRma();
    };

    vm.loadRma = function () {
      var query = '?';
      query += $httpParamSerializer(vm.filters) + '&';
      query = query + 'sort=' + (vm.sortFilters.order ? '' : '-') + vm.sortFilters.sort + '&';
      query = query + 'page=' + vm.pagination.page + '&';
      query = query + 'limit=' + vm.pagination.limit;
      Rma.getAll(query)
        .then(function (response) {
          vm.rmaes = response.data.docs;
          // vm.rmaes.forEach(function (rma) {
          //   rma.closedCount = rma.products.filter(function (product) {
          //     return product.closed;
          //   }).length;
          // });
          vm.pagination.total = response.data.total;
          vm.pagination.page = response.data.page;
        })
        .catch(function () {
          toastr.error('Something went wrong', 'Error');
        });
    };

    vm.delete = function (rma) {
      $uibModal.open({
        animation: true,
        component: 'confirmComponent',
        size: 'sm',
        resolve: {
          message: function () {
            return 'Are you sure to delete RMA ' + rma.formNumber + ' ?';
          }
        }
      }).result.then(function () {
        Rma.delete(rma)
          .then(function () {
            vm.loadRma();
          })
          .catch(function () {
            toastr.error('Something went wrong', 'Error');
          })
      });
    };

    vm.reset = function () {
      vm.filters = {};
      vm.loadRma();
    };
  }
})();
