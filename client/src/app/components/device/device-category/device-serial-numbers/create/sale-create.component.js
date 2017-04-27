(function () {
  angular
    .module('app')
    .component('createSaleComponent', {
      templateUrl: 'app/components/device/device-category/device-serial-numbers/create/sale-create.component.html',
      bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
      },
      controller: createSalesComponent,
      controllerAs: 'vm'
    });

  /** @ngInject */
  function createSalesComponent(Sales, toastr, Upload, Customers) {
    var vm = this;
    vm.$onInit = function () {
      vm.sale = vm.resolve.sale;
      if(vm.sale.date){
        vm.sale.date = new Date(vm.sale.date);
      }
    };
    vm.cancel = function () {
      vm.dismiss({$value: 'cancel'});
    };
    vm.save = function () {
      if(vm.sale._id){
        Sales.updateSale(vm.sale)
          .then(function () {
            vm.close({$value: vm.sale});
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
        Sales.createSale(vm.sale)
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
    };

    vm.getCustomers = function (customerName) {
      var query = '?page=1&limit=10&name=' + customerName;
      return Customers.getAll(query)
        .then(function (response) {
          return response.data.docs;
        });
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
    }
  }
})();
