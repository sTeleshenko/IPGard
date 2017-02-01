(function () {
  angular
    .module('app')
    .service('Sales', Sales);

  /** @ngInject */
  function Sales($http) {
    var self = this;
    self.getAll = function (query) {
      return $http.get('/api/sales' + query);
    };
    // self.getDevice = function (id) {
    //   return $http.get('/api/products/' + id);
    // };
    self.createSale = function (sale) {
      return $http.post('/api/sales', sale)
    };

    self.updateSale  = function (sale) {
      return $http.put('/api/sales/' + sale._id, sale)
    };
    self.deleteSale = function (sale) {
      return $http.delete('/api/sales/' + sale._id)
    };

  }

})();
