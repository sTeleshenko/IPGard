(function () {
  angular
    .module('app')
    .component('rmaCreateComponent', {
      templateUrl: 'app/components/rma/create/rma-create.component.html',
      controller: rmaCreateComponent,
      controllerAs: 'vm'
    });

  /** @ngInject */
  function rmaCreateComponent(
    Customers,
    StaticFields,
    toastr,
    $uibModal,
    Upload,
    Sales,
    Rma,
    $state,
    $stateParams,
    $filter,
    Auth) {
    var vm = this;
    vm.$onInit = function () {
      Auth.getCurrentUser()
        .then(function (user) {
          vm.user = user
        });
      vm.model = 'Rma';
      vm.customerFields = StaticFields.static['Customer'];
      vm.options = {};
      if($stateParams.id){
        vm.editMode = true;
        Rma.getOne($stateParams.id)
          .then(function (response) {
            vm.rma = response.data;
          })
          .catch(function () {
            toastr.error('Error loading RMA', 'Error');
          });

      } else {
        vm.editMode = false;
        vm.rma = {};
        vm.rma.products = [];
        vm.rma.totalCount = 0;
        vm.rma.closedCount = 0;
        vm.options.formNumberStatic = 'RY' + $filter('date')(new Date(), 'MMddyyyy');
      }
      vm.loadStaticFields();
    };

    vm.getCustomers = function (customerName) {
      var query = '?page=1&limit=10&name=' + customerName;
      return Customers.getAll(query)
        .then(function (response) {
          return response.data.docs;
        });
    };

    vm.getSerials = function (sn) {
      var query = '?page=1&limit=10&customerName=.&serialNumber=' + sn;
      return Sales.getAll(query)
        .then(function (response) {
          return response.data.docs;
        });
    };

    vm.openCustomerModal = function (ev) {
      ev.preventDefault();
      vm.loadCustomerFields()
        .then(function (fields) {
          var customer = {};
          customer.fields = fields.map(function (item) {
            return {
              field: item
            }
          });
          return customer;
        })
        .then(function (customer) {
          return $uibModal.open({
            animation: true,
            component: 'createCustomerComponent',
            resolve: {
              customer: function () {
                return angular.copy(customer);
              }
            }
          });
        })
        .then(function (modalInstance) {
          modalInstance.result.then(function (customer) {
            vm.rma.customer = customer;
            vm.onCustomerChanged();
          });
        });
    };

    vm.loadCustomerFields = function () {
      return StaticFields.getFields('Customer')
        .then(function (response) {
          return response.data;
        })
        .catch(function () {
          toastr.error('Something went wrong', 'Error');
        });
    };

    vm.onCustomerChanged = function (fromSerial) {
      vm.options.customerFromSerial = !!fromSerial;
    };

    vm.onSerialNumberChanged = function () {
      if(!vm.serialNumber) return false;
      var selected = vm.rma.products.some(function (item) {
        return item.sale._id === vm.serialNumber._id;
      });
      if(!selected) {
        vm.rma.products.push({
          sale: vm.serialNumber,
          fields: vm.staticFields.map(function (field) {
            return {
              field: field,
              value: ''
            };
          })
        });
        if(!vm.rma.customer) {
          vm.rma.customer = vm.serialNumber.customer;
          vm.onCustomerChanged(true);
        }
      }
      vm.serialNumber = '';
    };

    vm.deleteSerialNumber = function (sn) {
      for(var i = 0; i < vm.rma.products.length; i++){
        if(vm.rma.products[i]._id === sn._id) {
          vm.rma.products.splice(i, 1);
          break;
        }
      }
      vm.rma.products.splice(index, 1);
      if(!vm.rma.products.length && vm.options.customerFromSerial){
        vm.rma.customer = '';
      }
    };

    vm.loadStaticFields = function () {
      StaticFields.getFields(vm.model)
        .then(function (response) {
          vm.staticFields = response.data;
        })
        .catch(function () {
          toastr.error('Something went wrong', 'Error');
        });
    };
    vm.save = function () {
      if(vm.editMode){
        Rma.update(vm.rma)
          .then(function () {
            $state.go('rma')
          })
          .catch(function () {
            toastr.error('Something went wrong', 'Error');
          });
      } else{
        vm.rma.formNumber = vm.options.formNumberStatic + vm.options.formNumberDynamic;
        vm.rma.totalCount = vm.rma.products.length;
        Rma.create(vm.rma)
          .then(function () {
            $state.go('rma')
          })
          .catch(function () {
            toastr.error('Something went wrong', 'Error');
          });
      }
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

    vm.toggleEditedState = function (sn) {
      sn.editable = !sn.editable;
    };

    vm.closeAllChanged = function () {
      vm.rma.products.forEach(function (product) {
        product.closed = vm.rma.closed;
      });
    };
    vm.closeOneChanged = function () {
      vm.rma.closedCount = vm.rma.products.filter(function (product) {
        return product.closed;
      }).length;
      vm.rma.closed = vm.rma.totalCount === vm.rma.closedCount;
    };

  }
})();
