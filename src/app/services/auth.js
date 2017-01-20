(function () {
  angular
    .module('app')
    .service('Auth', Auth);

  /** @ngInject */
  function Auth($http, localStorageService, $q) {
    var self = this;
    self.isLoggedin = !!localStorageService.get('token');
    var currentUser = {};

    if (self.isLoggedin) {
      currentUser = me();
    }

    self.login = function (data) {
      return $http.post('http://localhost:8080/api/auth/local', data)
        .then(function (response) {
          localStorageService.set('token', response.data.token);
          self.isLoggedin = true;
          currentUser = me();
          return currentUser;
        });
    };

    self.getCurrentUser = function () {
      return $q.when(currentUser);
    };

    self.logOut = function () {
      localStorageService.remove('token');
      self.isLoggedin = false;
      currentUser = {};
    };

    function me() {
      return $http.get('http://localhost:8080/api/users/me')
        .then(function (response) {
          return response.data;
        });
    }
  }

})();
