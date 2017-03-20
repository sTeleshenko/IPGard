angular
  .module('app')
  .config(routesConfig);

/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider, $locationProvider) {
  var allRoles = ['admin', 'productionAdmin', 'productionUser', 'salesAdmin', 'salesUser', 'support'];
  var admins = ['admin', 'productionAdmin', 'salesAdmin'];
  var sales = ['admin', 'salesAdmin', 'salesUser'];
  var productions = ['admin', 'productionAdmin', 'productionUser'];
  var support = ['admin', 'support'];
  $locationProvider.html5Mode(true).hashPrefix('!');
  $urlRouterProvider.otherwise(function ($injector) {
    var auth = $injector.get('Auth');
    var state = $injector.get('$state');
    auth.getCurrentUser()
      .then(function (user) {
        if(productions.indexOf(user.role) !== -1){
          state.go('home');
        } else if(sales.indexOf(user.role) !== -1) {
          state.go('serials')
        } else if(support.indexOf(user.role) !== -1) {
          state.go('rma')
        } else {
          state.go('login');
        }
      })
  });
  $stateProvider
    .state('main', {
      abstract: true,
      component: 'mainComponent',
      data: {
        roles: allRoles
      }
    })
    .state('home', {
      url: '/devices',
      parent: 'main',
      component: 'homeComponent',
      data: {
        roles: productions
      }
    })
    .state('serials', {
      url: '/sales',
      parent: 'main',
      component: 'serialsComponent',
      data: {
        roles: sales
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
    .state('rma', {
      url: '/rma',
      parent: 'main',
      component: 'rmaComponent',
      data: {
        roles: support
      }
    })
    .state('rmaDetail', {
      url: '/rma/:id',
      parent: 'main',
      component: 'rmaCreateComponent',
      data: {
        roles: support
      }
    })
    .state('rmaCreate', {
      url: '/rma-create',
      parent: 'main',
      component: 'rmaCreateComponent',
      data: {
        roles: support
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
    .state('customers', {
      url: '/customers',
      parent: 'main',
      component: 'customersComponent',
      data: {
        roles: allRoles
      }
    })
    .state('static', {
      url: '/categories/static/:model',
      parent: 'main',
      component: 'staticComponent',
      data: {
        roles: ['admin']
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
      url: '/serialNumber?serialNumber',
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
