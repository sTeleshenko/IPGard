(function () {
  angular
    .module('app')
    .component('usersComponent', {
      templateUrl: 'app/components/users/users.component.html',
      controller: usersComponent,
      controllerAs: 'vm'
    });

  /** @ngInject */
  function usersComponent(Auth, Users, $uibModal) {
    var vm = this;
    vm.$onInit = function () {
      Auth.getCurrentUser()
        .then(function (user) {
          vm.user = user;
        });
      Users.getUsers()
        .then(function (response) {
          vm.users = response.data;
        })
        .catch(function () {
          toastr.error('Something went wrong', 'Error');
        })
    };


    vm.openUserModal = function (user, index) {
      var modalInstance = $uibModal.open({
        animation: true,
        component: 'createUserComponent',
        resolve: {
          user: function () {
            return angular.copy(user);
          }
        }
      });

      modalInstance.result.then(function (result) {
        // // vm.selected = selectedItem;
        // console.log(result)
        if(user._id === result._id) {
          vm.users[index] = result;
        } else {
          vm.users.push(result);
        }
      });
    };
    vm.delete = function (user, index) {
      $uibModal.open({
        animation: true,
        component: 'confirmComponent',
        size: 'sm',
        resolve: {
          message: function () {
            return 'Are you sure to delete user ' + user.name + '?';
          }
        }
      }).result.then(function () {
        Users.deleteUser(user)
          .then(function () {
            vm.users.splice(index, 1);
          })
          .catch(function () {
            toastr.error('Something went wrong', 'Error');
          })
      });
    }
  }
})();
