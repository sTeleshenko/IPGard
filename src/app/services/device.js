(function () {
  angular
    .module('app')
    .service('Device', Device);

  /** @ngInject */
  function Device($http) {
    var self = this;

    self.getAll = function (query) {
      return $http.get('http://localhost:8080/api/products' + query);
    };
    self.getDevice = function (id) {
      return $http.get('http://localhost:8080/api/products/' + id);
    };
    self.createDevice = function (device) {
      return $http.post('http://localhost:8080/api/products', device)
    };

    self.updateDevice  = function (device) {
      return $http.put('http://localhost:8080/api/products/' + device._id, device)
    };
    self.deleteDevice = function (device) {
      return $http.delete('http://localhost:8080/api/products/' + device._id)
    };
    // self.generate = function () {
    //   var products = [{
    //     model: 'siemens',
    //     partNumber: '334',
    //     upc: 'rtyeiew',
    //     description: 'mobila',
    //     serialNumber: '456372845'
    //   },
    //     {
    //       model: 'nokia',
    //       partNumber: '3354',
    //       upc: 'rtyeiew',
    //       description: 'mobila',
    //       serialNumber: '45sfsf2845'
    //     },
    //     {
    //       model: 'samsung',
    //       partNumber: '974',
    //       upc: 'rtyeiew',
    //       description: 'mobila',
    //       serialNumber: '987698'
    //     }
    //   ];
    //   products.forEach(function (product) {
    //     return $http.post('/api/products', product);
    //   })
    // }
  }

})();
