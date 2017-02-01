angular
  .module('app')
  .config(routesConfig);

/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
  $urlRouterProvider.otherwise('/');
  var allRoles = ['admin', 'productionAdmin', 'productionUser', 'salesAdmin', 'salesUser'];
  var admins = ['admin', 'productionAdmin', 'salesAdmin'];
  var sales = ['admin', 'salesAdmin', 'salesUser'];
  $stateProvider
    .state('main', {
      abstract: true,
      component: 'mainComponent',
      data: {
        roles: allRoles
      }
    })
    .state('home', {
      url: '/',
      parent: 'main',
      component: 'homeComponent',
      data: {
        roles: allRoles
      }
    })
    .state('users', {
      url: '/users',
      parent: 'main',
      component: 'usersComponent',
      data: {
        roles: admins
      }
    })
    .state('categories', {
      url: '/categories',
      parent: 'main',
      component: 'categoriesComponent',
      data: {
        roles: ['admin']
      }
    })
    .state('about', {
      url: '/about',
      parent: 'main',
      component: 'aboutComponent',
      data: {
        roles: allRoles
      }
    })
    .state('help', {
      url: '/help',
      parent: 'main',
      component: 'helpComponent',
      data: {
        roles: allRoles
      }
    })
    .state('fields', {
      url: '/categories/:id',
      parent: 'main',
      component: 'fieldsComponent',
      data: {
        roles: ['admin']
      }
    })
    .state('device', {
      url: '/device/:id',
      parent: 'main',
      component: 'deviceDetailComponent',
      data: {
        roles: allRoles
      }
    })
    .state('device.serialNumbers', {
      url: '/serialNumber',
      parent: 'device',
      component: 'deviceSerialNumbersComponent',
      data: {
        roles: sales
      }
    })
    .state('device.category', {
      url: '/:categoryId',
      parent: 'device',
      component: 'deviceCategoryComponent',
      data: {
        roles: allRoles
      }

    })
    .state('login', {
      url: '/login',
      component: 'loginComponent'
    });
}
