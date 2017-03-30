/**
 * Created by Sandeep on 01/06/14.
 */

angular.module('securityApp',['ui.router','ngResource','securityApp.controllers','securityApp.services']);

angular.module('securityApp').config(function($stateProvider, $httpProvider){
    $stateProvider
      // users
      .state('users',{
        url:'/users',
        templateUrl:'partials/users.html',
        controller:'UserListController'
      })
      .state('viewUser',{
        url:'/users/:id/view',
        templateUrl:'partials/user-view.html',
        controller:'UserViewController'
      })
      .state('newUser',{
        url:'/users/new',
        templateUrl:'partials/user-add.html',
        controller:'UserCreateController'
      })
      .state('editUser',{
        url:'/users/:id/edit',
        templateUrl:'partials/user-edit.html',
        controller:'UserEditController'})

    // securities
      .state('securities',{
        url:'/securities',
        templateUrl:'partials/securities.html',
        controller:'SecurityListController'
      })
      .state('viewSecurity',{
        url:'/securities/:id/view',
        templateUrl:'partials/security-view.html',
        controller:'SecurityViewController'
      })
      .state('newSecurity',{
        url:'/securities/new',
        templateUrl:'partials/security-add.html',
        controller:'SecurityCreateController'
      })
      .state('editSecurity',{
        url:'/securities/:id/edit',
        templateUrl:'partials/security-edit.html',
        controller:'SecurityEditController'})

      // clients
      .state('clients',{
        url:'/clients',
        templateUrl:'partials/clients.html',
        controller:'ClientListController'
      })
      .state('viewClient',{
        url:'/clients/:id/view',
        templateUrl:'partials/client-view.html',
        controller:'ClientViewController'
      })
      .state('newClient',{
        url:'/clients/new',
        templateUrl:'partials/client-add.html',
        controller:'ClientCreateController'
      })
      .state('editClient',{
        url:'/clients/:id/edit',
        templateUrl:'partials/client-edit.html',
        controller:'ClientEditController'})
    ;
}).run(function($state){
   $state.go('users');
});