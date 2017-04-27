(function () {
  angular
    .module('app')
    .service('Customers', Customers);

  /** @ngInject */
  function Customers($http) {
    var self = this;

    self.getAll = function (query) {
      return $http.get('/api/customers' + query);
    };

    self.create = function (customer) {
      return $http.post('/api/customers', customer)
    };
    self.createCollection = function (customers) {
      return $http.post('/api/customers/collection', customers)
    };

    self.update  = function (customer) {
      return $http.put('/api/customers/' + customer._id, customer)
    };
    self.delete = function (customer) {
      return $http.delete('/api/customers/' + customer._id)
    };

  }

})();
