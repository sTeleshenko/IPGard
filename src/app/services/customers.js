(function () {
  angular
    .module('app')
    .service('Customers', Customers);

  /** @ngInject */
  function Customers($http) {
    var self = this;

    self.fields = [
      {
        key: 'name',
        label: 'Name',
        required: true,
        type: 'text'
      },
      {
        key: 'phone',
        label: 'Phone',
        required: true,
        type: 'text'
      },
      {
        key: 'contactPerson',
        label: 'Contact Person',
        required: true,
        type: 'text'
      },
      {
        key: 'email',
        label: 'Email',
        required: true,
        type: 'email'
      },
      {
        key: 'salesRep',
        label: 'Sales Rep',
        required: false,
        type: 'text'
      },
      {
        key: 'address',
        label: 'Address',
        required: true,
        type: 'text'
      },
      {
        key: 'city',
        label: 'City',
        required: true,
        type: 'text'
      },
      {
        key: 'zipCode',
        label: 'Zip Code',
        required: true,
        type: 'text'
      },
      {
        key: 'state',
        label: 'State',
        required: true,
        type: 'text'
      },
      {
        key: 'country',
        label: 'Country',
        required: true,
        type: 'text'
      }
    ];

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
