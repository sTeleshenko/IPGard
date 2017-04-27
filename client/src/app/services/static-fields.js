(function () {
  angular
    .module('app')
    .service('StaticFields', StaticFields);

  /** @ngInject */
  function StaticFields($http) {
    var self = this;

    self.getFields = function (model) {
      return $http.get('/api/static-fields?model=' + model);
    };

    self.getField = function (id) {
      return $http.get('/api/static-fields/' + id);
    };

    self.createField = function (field) {
      return $http.post('/api/static-fields', field)
    };

    self.updateField  = function (field) {
      return $http.put('/api/static-fields/' + field._id, field)
    };
    self.deleteField = function (field) {
      return $http.delete('/api/static-fields/' + field._id)
    };
    self.loadTypes = function () {
      return $http.get('/api/types')
    };

    var Field = function (name, type, required) {
      this.label = name;
      this.type = type;
      this.required = required;
    };

    self.static = {
      'Sale': [
        new  Field('Serial Number', 'String', true),
        new  Field('Version', 'String', true),
        new  Field('Sales Order', 'String', false),
        new  Field('Date', 'Date', false),
        new  Field('Customer Name', 'Customer', false)
      ],
      'Customer': [
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
      ],
      'Rma': [
        new  Field('Serial Number', 'String', true),
        new  Field('Version', 'String', true),
        new  Field('Sales Order', 'String', true),
        new  Field('Date', 'Date', true),
        new  Field('Customer Name', 'Customer', true)
      ]
    }
  }

})();
