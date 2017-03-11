// (function () {
//   angular
//     .module('app')
//     .directive('print', print);
//
//   /** @ngInject */
//   function print() {
//     return {
//       restrict: 'A',
//       scope: {
//         print: '<'
//       },
//       link: function (scope, element, attr) {
//         $(element).click(function (e) {
//           window.print($(element[0]))
//         })
//       }
//     }
//   }
// })();
