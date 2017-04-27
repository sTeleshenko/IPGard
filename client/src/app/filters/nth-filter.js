angular
  .module('app')
  .filter('nthChild', function () {
    return function (items, nth) {
      if(!items || !angular.isArray(items)) return items;
      return items.filter(function (item, index) {
        return index % 2 === nth;
      });
    };
  });
