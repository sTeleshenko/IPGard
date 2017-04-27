(function () {
  angular
    .module('app')
    .factory('AuthInterceptor', AuthInterceptor);

  /** @ngInject */
  function AuthInterceptor (localStorageService, $q, $injector) {
    return {
      request: function (config) {
        config.headers = config.headers || {};
        config.headers['authorization'] = 'Bearer ' + localStorageService.get('token');
        return config;
      },
      responseError: function (response) {
        if(response.status === 401){
          var state = $injector.get('$state');
          if(state.$current.name !== 'login') state.go('login');
        }
        return $q.reject(response);
      }
    };
  }
})();
