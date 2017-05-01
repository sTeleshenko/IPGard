(function () {
    angular
        .module('app')
        .component('salesGroupsComponent', {
            templateUrl: 'app/components/sales-groups/sales-groups.component.html',
            controller: salesGroupsComponent,
            controllerAs: 'vm'
        });

    /** @ngInject */
    function salesGroupsComponent() {
        var vm = this;

    }
})();
