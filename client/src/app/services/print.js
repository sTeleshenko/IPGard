(function () {
  angular
    .module('app')
    .factory('printElement', printElement);

  /** @ngInject */
  function printElement() {
    return function(printSectionId) {
      var innerContents = document.getElementById(printSectionId).innerHTML;
      var popupWinindow = window.open('', '_blank', 'width=1000,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
      popupWinindow.document.open();
      popupWinindow.document.write('<html><head>' +
        '<style>' +
        'body{font-family: Arial, sans-serif;}' +
        'table{width: 100%;} ' +
        '.no-print{display: none!important;}' +
        '.table-bordered>thead>tr>th, .table-bordered>thead>tr>th, table-bordered>tbody>tr>th, ' +
        '.table-bordered>tbody>tr>th, table-bordered>tfoot>tr>th, .table-bordered>tfoot>tr>th, ' +
        'table-bordered>thead>tr>td, .table-bordered>thead>tr>td, table-bordered>tbody>tr>td, ' +
        '.table-bordered>tbody>tr>td, table-bordered>tfoot>tr>td, .table-bordered>tfoot>tr>td {' +
        'border: 1px solid #ecf0f1;}' +
        '</style>' +
        '</head><body onload="window.print()">' + innerContents + '</html>');
      popupWinindow.document.close();
    }
  }

})();
