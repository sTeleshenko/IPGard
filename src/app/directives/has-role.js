(function () {
  angular
    .module('app')
    .directive('hasRole', hasRole);

  /** @ngInject */
  function hasRole(Auth) {
    return {
      restrict: 'A',
      scope: {
        hasRole: '<'
      },
      link: function (scope, element, attr) {
        Auth.getCurrentUser()
          .then(function (user) {
            if(scope.hasRole.indexOf(user.role) === -1){
              element.hide();
            }
          })
      }
    }
  }
})();
