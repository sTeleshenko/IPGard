(function () {
    angular
        .module('app')
        .component('quantityChangeComponent', {
            templateUrl: 'app/components/sales-groups/create/quantity-change/quantity-change.html',
            controller: quantityChangeComponent,
            controllerAs: 'vm',
            bindings: {
                close: '&',
                dismiss: '&'
            }
        });

    /** @ngInject */
    function quantityChangeComponent() {
        var vm = this;

        vm.save = function () {
            vm.close({$value: vm.quantity});
        };

        vm.cancel = function () {
            vm.dismiss({$value: 'cancel'});
        };

    }
})();
