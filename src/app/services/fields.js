(function () {
  angular
    .module('app')
    .service('Fields', Fields);

  /** @ngInject */
  function Fields($http) {
    var self = this;

    self.getFields = function (categoryId) {
      return $http.get('http://localhost:8080/api/fields?category=' + categoryId);
    };

    self.createField = function (field) {
      return $http.post('http://localhost:8080/api/fields', field)
    };

    self.updateField  = function (field) {
      return $http.put('http://localhost:8080/api/fields/' + field._id, field)
    };
    self.deleteField = function (field) {
      return $http.delete('http://localhost:8080/api/fields/' + field._id)
    };
    self.loadTypes = function () {
      return $http.get('http://localhost:8080/api/types')
    };

    // var fields = [
    //   {
    //     label: 'Number',
    //     value: 'number'
    //   },
    //   {
    //     label: 'String',
    //     value: 'text'
    //   },
    //   {
    //     label: 'Long text',
    //     value: 'longText'
    //   }
    // ]
    // fields.forEach(function (item) {
    //   $http.post('http://localhost:8080/api/types', item)
    // })
  }

})();
