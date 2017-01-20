(function () {
  angular
    .module('app')
    .service('Users', Users);

  /** @ngInject */
  function Users($http) {
    var self = this;

    self.getUsers = function () {
      return $http.get('http://localhost:8080/api/users');
    };

    self.createUser = function (user) {
      return $http.post('http://localhost:8080/api/users', user)
    };

    self.updateUser  = function (user) {
      return $http.put('http://localhost:8080/api/users/' + user._id, user)
    };
    self.deleteUser = function (user) {
      return $http.delete('http://localhost:8080/api/users/' + user._id)
    };

  }

})();
