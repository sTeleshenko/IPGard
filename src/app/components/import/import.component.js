(function () {
  angular
    .module('app')
    .component('importComponent', {
      templateUrl: 'app/components/import/import.component.html',
      bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
      },
      controller: importComponent,
      controllerAs: 'vm'
    });

  /** @ngInject */
  function importComponent() {
    var vm = this;
    vm.$onInit = function () {
      vm.headers = vm.resolve.headers;
      vm.data = [];
      vm.editedData = [];
      vm.pagination = {
        limit: 50,
        parts: 0,
        total: 0,
        part: 0
      };
    };

    vm.onDataChanged = function () {
      if(vm.resolve.parser) {
        vm.resolve.parser(vm.data);
      }
      vm.pagination.total = vm.data.length;
      vm.pagination.part = 0;
      vm.pagination.parts = Math.ceil(vm.pagination.total / vm.pagination.limit);
      vm.nextPart();
    };

    vm.nextPart =function () {
      vm.pagination.part++;
      vm.editedData = vm.data.splice(0, vm.pagination.limit);
      console.log(vm.editedData)
    };

    vm.save = function () {
      vm.resolve.save(vm.editedData)
        .then(function () {
          if(!vm.data.length) {
            vm.close();
          } else {
            vm.nextPart();
          }
        });
    };

    vm.cancel = function () {
      vm.dismiss({$value: 'cancel'});
    };
  }
})();
