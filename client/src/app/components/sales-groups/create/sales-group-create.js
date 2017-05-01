(function () {
    angular
        .module('app')
        .component('salesGroupCreateComponent', {
            templateUrl: 'app/components/sales-groups/create/sales-group-create.html',
            controller: salesGroupCreateComponent,
            controllerAs: 'vm'
        });

    /** @ngInject */
    function salesGroupCreateComponent(Customers, Device, Sales) {
        var vm = this;
        vm.$onInit = function () {
            vm.salesGroup ={};
            vm.salesGroup.items = [];

        };

        vm.getCustomers = function (customerName) {
            var query = '?page=1&limit=10&name=' + customerName;
            return Customers.getAll(query)
                .then(function (response) {
                    return response.data.docs;
                });
        };
        vm.onResellerChanged = function () {
            if (!vm.salesGroup.endUser) {
                vm.salesGroup.endUser = angular.copy(vm.salesGroup.reseller);
            }
        };

        vm.onEndUserChanged = function () {
            if (!vm.salesGroup.reseller) {
                vm.salesGroup.reseller = angular.copy(vm.salesGroup.endUser);
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
            Sales.createSale({
                product: item.product,
                serialNumber: item.serialNumber
            })
                .then(function (response) {
                    console.log(response.data)
                })
                .catch(function () {
                    console.log('err')
                })
        }

    }
})();
