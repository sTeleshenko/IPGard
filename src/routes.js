angular
  .module('app')
  .config(routesConfig);

/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
  $urlRouterProvider.otherwise('/');
  var allRoles = ['admin', 'productionAdmin', 'productionUser', 'salesAdmin', 'salesUser'];
  var admins = ['admin', 'productionAdmin', 'salesAdmin'];
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
    .state('fields', {
      url: '/categories/:id',
      parent: 'main',
      component: 'fieldsComponent',
      data: {
        roles: allRoles
      }
    })
    .state('device', {
      url: '/device/:id',
      parent: 'main',
      component: 'deviceDetailComponent',
      data: {
        roles: ['admin']
      }
    })
    .state('login', {
      url: '/login',
      component: 'loginComponent'
    });
}
