(function () {
    angular
        .module('app')
        .component('salesGroupsComponent', {
            templateUrl: 'app/components/sales-groups/sales-groups.component.html',
            controller: salesGroupsComponent,
            controllerAs: 'vm'
        });

    /** @ngInject */
    function salesGroupsComponent(SalesGroup, localStorageService, $httpParamSerializer, toastr, $uibModal) {
        var vm = this;
        vm.$onInit = function () {
            vm.salesGroups = [];
            vm.sortFilters = localStorageService.get('salesGroupsSortFilters') || {
                    sort: 'salesOrder',
                    order: true
                };
            vm.limits = [10, 20, 50, 100];
            vm.pagination = {
                total: 0,
                page: 1,
                limit: localStorageService.get('paginationLimit') || 10
            };
            vm.filters = localStorageService.get('salesGroupsFilters') || {};
            vm.loadSalesGroups();
        };

        vm.onLimitChange = function () {
            localStorageService.set('paginationLimit', vm.pagination.limit);
            vm.loadSalesGroups();
        };

        vm.onFiltersChanged  = function (filters) {
            localStorageService.set('salesGroupsFilters', filters);
            vm.filters = filters;
            vm.loadSalesGroups();
        };
        vm.onSortFiltersChanged = function (key) {
            if(vm.sortFilters.sort === key){
                vm.sortFilters.order = !vm.sortFilters.order;
            } else {
                vm.sortFilters.sort = key;
                vm.sortFilters.order = true;
            }
            localStorageService.set('salesGroupsSortFilters', vm.sortFilters);
            vm.loadSalesGroups();
        };


        vm.loadSalesGroups = function () {
            var query = '?';
            query += $httpParamSerializer(vm.filters) + '&';
            query = query + 'sort=' + (vm.sortFilters.order ? '' : '-') + vm.sortFilters.sort + '&';
            query = query + 'page=' + vm.pagination.page + '&';
            query = query + 'limit=' + vm.pagination.limit;
            SalesGroup.getAll(query)
                .then(function (response) {
                    vm.salesGroups = response.data.docs;
                    vm.pagination.total = response.data.total;
                    vm.pagination.page = response.data.page;
                })
                .catch(function () {
                    toastr.error('Something went wrong', 'Error');
                });
        };

        vm.reset = function () {
            vm.filters = {};
            vm.loadSalesGroups();
        };

        vm.delete = function (salesGroup) {
            $uibModal.open({
                animation: true,
                component: 'confirmComponent',
                size: 'sm',
                resolve: {
                    message: function () {
                        return 'Are you sure to delete Sales Order ' + salesGroup.salesOrder + ' ?';
                    }
                }
            }).result.then(function () {
                SalesGroup.delete(salesGroup)
                    .then(function () {
                        vm.loadSalesGroups();
                    })
                    .catch(function () {
                        toastr.error('Something went wrong', 'Error');
                    })
            });
        };


    }
})();
