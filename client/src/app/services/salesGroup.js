(function () {
    angular
        .module('app')
        .service('SalesGroup', salesGroup);

    /** @ngInject */
    function salesGroup($http) {
        var self = this;

        self.create = function (salesGroup) {
            return $http.post('/api/sales-group' + salesGroup);
        };


    }

})();
