(function () {
  angular
    .module('app')
    .component('navbarComponent', {
      templateUrl: 'app/components/navbar/navbar.component.html',
      controller: NavbarController,
      controllerAs: 'vm'
    });

  /** @ngInject */
  function NavbarController(Auth) {
    var vm = this;
    vm.$onInit = function () {
      vm.isNavCollapsed = false;
      Auth.getCurrentUser()
        .then(function (user) {
          vm.user = user;
        });
    };
  }
})();
