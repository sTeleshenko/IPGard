(function () {
  angular
    .module('app')
    .directive('fileread', function () {
      return {
        scope: {
          headers: '<',
          onDataChanged: '&',
          parseStarted: '&'
        },
        link: function ($scope, $elm, $attrs) {
          $elm.on('change', function (changeEvent) {

            $scope.$apply(function () {
              $scope.parseStarted();
            });
            var reader = new FileReader();

            reader.onload = function (evt) {
              var data = evt.target.result;
              var workbook = XLSX.read(data, {type: 'binary', cellDates: true});
              data = XLSX.utils.sheet_to_json(
                workbook.Sheets[workbook.SheetNames[0]],
                {
                  header: $scope.headers.map(function (item) {
                    return item.key
                  })
                }
              );

              $scope.$apply(function () {
                $scope.onDataChanged({data: data});
                $elm.val(null);
              });
            };
            reader.readAsBinaryString(changeEvent.target.files[0]);
          });
        }
      }
    })
})();
