(function () {
  angular
    .module('app')
    .component('documentCreateComponent', {
      templateUrl: 'app/components/document/document-create/document-create.component.html',
      controller: documentCreateComponent,
      controllerAs: 'vm',
      bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
      }
    });

  /** @ngInject */
  function documentCreateComponent(Documents, Upload) {
    var vm = this;
    vm.$onInit = function () {
      vm.document = vm.resolve.document;
    };
    vm.cancel = function () {
      vm.dismiss({$value: 'cancel'});
    };
    vm.save = function () {
      vm.loadInProgress = true;
      if(vm.document._id){
        Documents.updateDocument(vm.document)
          .then(function () {
            vm.close({$value: vm.document});
          })
          .catch(function (error) {
            var message;
            if (error.data && error.data.message) {
              message = error.data.message;
            } else {
              message = 'Something went wrong';
            }
            toastr.error(message, 'Error');
          })
          .finally(function () {
            vm.loadInProgress = false;
          });;
      } else {
        Documents.createDocument(vm.document)
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
          })
          .finally(function () {
            vm.loadInProgress = false;
          });;
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
    }
  }
})();
