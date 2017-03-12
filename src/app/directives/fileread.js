(function () {
  angular
    .module('app')
    .directive('fileread', function () {
      return {
        scope: {
          headers: '<',
          data: '=',
          onDataChanged: '&'
        },
        link: function ($scope, $elm, $attrs) {
          $elm.on('change', function (changeEvent) {
            var reader = new FileReader();

            reader.onload = function (evt) {
              $scope.$apply(function () {
                var data = evt.target.result;
                var workbook = XLSX.read(data, {type: 'binary', cellDates: true});
                $scope.data = XLSX.utils.sheet_to_json(
                  workbook.Sheets[workbook.SheetNames[0]],
                  { header: $scope.headers.map(function (item) {
                      return item.key
                    })
                  }
                );

                $elm.val(null);
              });
              $scope.$apply(function () {
                $scope.onDataChanged();
              });
            };
            reader.readAsBinaryString(changeEvent.target.files[0]);
          });
        }
      }
    })
})()
