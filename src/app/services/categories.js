(function () {
  angular
    .module('app')
    .service('Category', Category);

  /** @ngInject */
  function Category($http) {
    var self = this;

    self.getCategories = function () {
      return $http.get('http://localhost:8080/api/categories');
    };
    self.getCategory = function (id) {
      return $http.get('http://localhost:8080/api/categories/' + id);
    };
    self.createCategory = function (category) {
      return $http.post('http://localhost:8080/api/categories', category)
    };

    self.updateCategory  = function (category) {
      return $http.put('http://localhost:8080/api/categories/' + category._id, category)
    };
    self.deleteCategory = function (category) {
      return $http.delete('http://localhost:8080/api/categories/' + category._id)
    };

  }

})();
