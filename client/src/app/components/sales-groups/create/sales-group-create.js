(function () {
    angular
        .module('app')
        .component('salesGroupCreateComponent', {
            templateUrl: 'app/components/sales-groups/create/sales-group-create.html',
            controller: salesGroupCreateComponent,
            controllerAs: 'vm'
        });

    /** @ngInject */
    function salesGroupCreateComponent(
        Customers,
        Device,
        Sales,
        toastr,
        SalesGroup,
        $state,
        $stateParams,
        $uibModal,
        StaticFields,
        $httpParamSerializer) {
        var vm = this;
        vm.$onInit = function () {
            vm.editMode = !!$stateParams.id;

            if (vm.editMode) {
                SalesGroup.getOne($stateParams.id)
                    .then(function (response) {
                        vm.salesGroup = response.data;
                        vm.salesGroup.date = new Date(vm.salesGroup.date);
                    })
                    .catch(function () {
                        toastr.error('Sales Order with id ' + $stateParams.id + ' not Found', 'Error');
                        $state.go('salesGroups');
                    });
            } else {
                vm.salesGroup = {
                    date: new Date()
                };
                vm.salesGroup.items = [];
            }
        };

        vm.openCustomerModal = function (ev, modelKey) {
            ev.preventDefault();
            vm.loadCustomerFields()
                .then(function (fields) {
                    var customer = {};
                    customer.fields = fields.map(function (item) {
                        return {
                            field: item
                        }
                    });
                    return customer;
                })
                .then(function (customer) {
                    return $uibModal.open({
                        animation: true,
                        component: 'createCustomerComponent',
                        resolve: {
                            customer: function () {
                                return angular.copy(customer);
                            }
                        }
                    });
                })
                .then(function (modalInstance) {
                    modalInstance.result.then(function (customer) {
                        vm.salesGroup[modelKey] = customer;
                        if (modelKey === 'customer') {
                            vm.onEndUserChanged();
                        } else {
                            vm.onResellerChanged();
                        }
                    });
                });
        };

        vm.loadCustomerFields = function () {
            return StaticFields.getFields('Customer')
                .then(function (response) {
                    return response.data;
                })
                .catch(function () {
                    toastr.error('Something went wrong', 'Error');
                });
        };

        vm.getCustomers = function (customerName) {
            var _query = {
                page: 1,
                limit: 10000000000,
                name: customerName,
                sort: 'name'
            };
            var query = '?' + $httpParamSerializer(_query);
            // var query = '?page=1&limit=10&name=' + customerName;
            return Customers.getAll(query)
                .then(function (response) {
                    return response.data.docs;
                });
        };
        vm.onResellerChanged = function () {
            if (!vm.salesGroup.customer) {
                vm.salesGroup.customer = angular.copy(vm.salesGroup.reseller);
            }
        };

        vm.onEndUserChanged = function () {
            if (!vm.salesGroup.reseller) {
                vm.salesGroup.reseller = angular.copy(vm.salesGroup.customer);
            }
        };

        vm.getProducts = function (product) {
            var _query = {
                page: 1,
                limit: 10000000000,
                model: product,
                sort: 'model'
            };
            var query = '?' + $httpParamSerializer(_query);
            // var query = '?page=1&limit=10&model=' + product;
            return Device.getAll(query)
                .then(function (response) {
                    return response.data.docs;
                });
        };

        vm.onProductChanged = function () {
            if (!vm.product) return false;
            var selected = vm.salesGroup.items.some(function (item) {
                return item.product._id === vm.product._id;
            });
            if (!selected) {
                vm.salesGroup.items.push({
                    product: vm.product,
                    serials: []
                });
            }
            vm.product = '';
        };

        vm.deleteProduct = function (index) {
            vm.salesGroup.items.splice(index, 1)
        };

        vm.getSerials = function (product, sn) {
            var _query = {
                page: 1,
                limit: 10000000000,
                product: product._id,
                serialNumber: sn,
                sort: 'serialNumber'
            };
            var query = '?' + $httpParamSerializer(_query);
            // var query = '?page=1&limit=10&product=' + product._id +'&serialNumber=' + sn;
            return Sales.getAll(query)
                .then(function (response) {
                    return response.data.docs;
                });
        };

        vm.onSerialNumberChanged = function (item) {
            if (!item.serialNumber) return false;
            var selected = item.serials.some(function (serial) {
                return serial._id === item.serialNumber._id;
            });
            if (!selected) {
                item.serials.push(item.serialNumber);
            }
            item.serialNumber = '';
        };

        vm.deleteSerial = function (item, index) {
            item.serials.splice(index, 1);
        };

        vm.addProduct = function () {
            if (!vm.product) return false;
            var product = {
                model: vm.product
            };
            Device.createDevice(product)
                .then(function (response) {
                    vm.salesGroup.items.push({
                        product: response.data,
                        serials: []
                    });
                    vm.product = '';
                })
                .catch(function () {
                    toastr.error('Something went wrong', 'Error');
                });
        };

        vm.addSerial = function (item) {
            var serial = {
                product: item.product,
                serialNumber: item.serialNumber
            };
            item.serialNumber = '';
            Sales.createSale(serial)
                .then(function (response) {
                    item.serials.push(response.data);
                })
                .catch(function () {
                    toastr.error('Something went wrong', 'Error');
                });
        };

        vm.save = function () {
            SalesGroup.create(vm.salesGroup)
                .then(function () {
                    toastr.success('Sales Order successfully created', 'Success');
                    $state.go('salesGroups')

                })
                .catch(function () {
                    toastr.error('Something went wrong', 'Error');
                });
        }

    }
})();
