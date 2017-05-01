(function () {
    angular
        .module('app')
        .component('salesGroupCreateComponent', {
            templateUrl: 'app/components/sales-groups/create/sales-group-create.html',
            controller: salesGroupCreateComponent,
            controllerAs: 'vm'
        });

    /** @ngInject */
    function salesGroupCreateComponent(Customers, Device, Sales, toastr, SalesGroup, $state, $stateParams) {
        var vm = this;
        vm.$onInit = function () {
            vm.editMode = !!$stateParams.id;

            if(vm.editMode){
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
                vm.salesGroup = {};
                vm.salesGroup.items = [];
            }
        };

        vm.getCustomers = function (customerName) {
            var query = '?page=1&limit=10&name=' + customerName;
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
            var query = '?page=1&limit=10&model=' + product;
            return Device.getAll(query)
                .then(function (response) {
                    return response.data.docs;
                });
        };

        vm.onProductChanged = function () {
            if(!vm.product) return false;
            var selected = vm.salesGroup.items.some(function (item) {
                return item.product._id === vm.product._id;
            });
            if(!selected){
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
            var query = '?page=1&limit=10&product=' + product._id +'&serialNumber=' + sn;
            return Sales.getAll(query)
                .then(function (response) {
                    return response.data.docs;
                });
        };

        vm.onSerialNumberChanged = function (item) {
            if(!item.serialNumber) return false;
            var selected = item.serials.some(function (serial) {
                return serial._id === item.serialNumber._id;
            });
            if(!selected) {
                item.serials.push(item.serialNumber);
            }
            item.serialNumber = '';
        };

        vm.deleteSerial = function (item, index) {
            item.serials.splice(index, 1);
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
