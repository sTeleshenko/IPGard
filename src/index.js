angular
  .module('app', ['ui.router', 'ui.bootstrap', 'ngMessages', 'LocalStorageModule', 'toastr', 'ngAnimate'])
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  })
  .run(function ($transitions, $q) {
    var match = {
      to: function (state) {
        return state.data && state.data.roles;
      }
    };
    $transitions.onStart(match, function (trans) {
      var Auth = trans.injector().get('Auth');
      var state = trans.$to();
      return Auth.getCurrentUser()
        .then(function (user) {
          if(!user.hasOwnProperty('role') || state.data.roles.indexOf(user.role) === -1){
            return $q.reject('access error');
          }
        });
    });
    $transitions.onError(match, function (trans) {
      var $state = trans.router.stateService;
      $state.go('login');
    });
  });

