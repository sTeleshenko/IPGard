(function () {
  angular
    .module('app')
    .service('Rma', Rma);

  /** @ngInject */
  function Rma($http) {
    var self = this;

    self.getAll = function (query) {
      return $http.get('/api/rma' + query);
    };

    self.getOne = function (id) {
      return $http.get('/api/rma/' + id);
    };

    self.create = function (rma) {
      return $http.post('/api/rma', rma)
    };

    self.update  = function (rma) {
      return $http.put('/api/rma/' + rma._id, rma)
    };
    self.delete = function (rma) {
      return $http.delete('/api/rma/' + rma._id)
    };

  }

})();
