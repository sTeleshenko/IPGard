(function () {
  angular
    .module('app')
    .component('confirmComponent', {
      templateUrl: 'app/components/confirm/confirm.component.html',
      bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
      },
      controller: function () {

      },
      controllerAs: 'vm'
    });
})();
