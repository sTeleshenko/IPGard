(function () {
    angular
        .module('app')
        .component('salesOrdersComponent', {
            templateUrl: 'app/components/sales-orders/sales-orders.component.html',
            controller: salesOrdersComponent,
            controllerAs: 'vm'
        });

    /** @ngInject */
    function salesOrdersComponent() {
        var vm = this;

    }
})();
