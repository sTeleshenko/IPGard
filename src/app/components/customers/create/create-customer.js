(function () {
  angular
    .module('app')
    .component('createCustomerComponent', {
      templateUrl: 'app/components/customers/create/create-customer.html',
      bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
      },
      controller: createCustomerComponent,
      controllerAs: 'vm'
    });

  /** @ngInject */
  function createCustomerComponent(Customers, toastr, StaticFields, Upload, printElement) {
    var vm = this;
    vm.$onInit = function () {
      vm.fields = StaticFields.static['Customer'];
      vm.customer = vm.resolve.customer;
    };
    vm.cancel = function () {
      vm.dismiss({$value: 'cancel'});
    };

    vm.convertDate = function (obj) {
      if(obj.value){
        obj.value = new Date(obj.value);
      }
    };

    vm.upload = function (file, obj) {
      Upload.upload({
        url: '/api/upload',
        data: {
          file: file
        }
      })
        .then(function (response) {
          obj.value = response.data;
        }, function (resp) {
          console.log('Error status: ' + resp.status);
        }, function (evt) {
          obj.progress = parseInt(100.0 * evt.loaded / evt.total);
        })
    };
    vm.save = function () {
      if(vm.customer._id){
        Customers.update(vm.customer)
          .then(function () {
            vm.close({$value: vm.customer});
          })
          .catch(function (error) {
            var message;
            if (error.data && error.data.message) {
              message = error.data.message;
            } else {
              message = 'Something went wrong';
            }
            toastr.error(message, 'Error');
          });
      } else {
        Customers.create(vm.customer)
          .then(function (response) {
            vm.close({$value: response.data});
          })
          .catch(function (error) {
            var message;
            if (error.data && error.data.message) {
              message = error.data.message;
            } else {
              message = 'Something went wrong';
            }
            toastr.error(message, 'Error');
          });
      }
    }
    vm.print = function (id) {
      printElement(id)
    }
  }
})();
