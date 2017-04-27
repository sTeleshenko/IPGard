(function () {
  angular
    .module('app')
    .component('createUserComponent', {
      templateUrl: 'app/components/users/create/create.user.component.html',
      bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
      },
      controller: createUserComponent,
      controllerAs: 'vm'
    });

  /** @ngInject */
  function createUserComponent(Auth, Users, toastr) {
    var vm = this;
    vm.$onInit = function () {
      vm.user = vm.resolve.user;
      var allRoles = [
        {
          label: 'Production admin',
          value: 'productionAdmin'
        },
        {
          label: 'Production user',
          value: 'productionUser'
        },
        {
          label: 'Sales admin',
          value: 'salesAdmin'
        },
        {
          label: 'Sales user',
          value: 'salesUser'
        },
        {
          label: 'Super Admin',
          value: 'admin'
        },
        {
          label: 'Support',
          value: 'support'
        }
      ];
      Auth.getCurrentUser()
        .then(function (user) {
          if(user.role === 'admin'){
            vm.roles = allRoles;
          } else if (user.role === 'productionAdmin'){
            vm.roles = allRoles.filter(function (role) {
              return role.value.indexOf('productionUser') !== -1;
            });
          } else if (user.role === 'salesAdmin'){
            vm.roles = allRoles.filter(function (role) {
              return role.value.indexOf('salesUser') !== -1;
            });
          } else {
            vm.roles = [];
          }
        })
    };

    vm.cancel = function () {
      vm.dismiss({$value: 'cancel'});
    };
    vm.save = function () {
      if(vm.user._id){
        Users.updateUser(vm.user)
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
      } else {
        Users.createUser(vm.user)
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
  }
})();
