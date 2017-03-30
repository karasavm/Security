/**
 * Created by Sandeep on 01/06/14.
 */
angular.module('securityApp.controllers',[])

// USERS 
  .controller('UserListController',function($scope, $state, popupService, $window, User){

      $scope.users = User.query();

      $scope.deleteUser = function(user){
          if(popupService.showPopup('Really delete this?')){
              user.$delete(function(){
                  $window.location.href='';
              });
          }
      }

  })
  .controller('UserViewController',function($scope,$stateParams,User){

      $scope.user = User.get({id:$stateParams.id});

  })
  .controller('UserCreateController',function($scope,$state,$stateParams,User){
      $scope.user = new User();
      $scope.addUser = function(){
          $scope.user.$save(function(){
              $state.go('users');
          });
      }
  })
  .controller('UserEditController',function($scope,$state,$stateParams,User){

      $scope.updateUser = function(){
          console.log("updaaaate")
          $scope.user.$update(function(){
              $state.go('users');
          });
      };

      $scope.loadUser = function(){
          $scope.user = User.get({id:$stateParams.id});
      };

      $scope.loadUser();
  })

// SECURITIES
  .controller('SecurityListController',function($scope, $state, popupService, $window, Security){

      $scope.securities = Security.query();

      $scope.deleteSecurity = function(security){
          if(popupService.showPopup('Really delete this?')){
              security.$delete(function(){
                  $window.location.href='';
              });
          }
      }
  })
  .controller('SecurityViewController',function($scope,$stateParams, Security){

      $scope.security = Security.get({id:$stateParams.id});

  })
  .controller('SecurityCreateController',function($scope,$state,$stateParams,Security){
      $scope.security = new Security();
      $scope.addSecurity = function(){
          $scope.security.$save(function(){
              $state.go('securities');
          });
      }
  })
  .controller('SecurityEditController',function($scope,$state,$stateParams,Security){

      $scope.updateSecurity = function(){

          $scope.security.$update(function(){
              $state.go('securities');
          });
      };

      $scope.loadSecurity = function(){
          $scope.security = Security.get({id:$stateParams.id});
      };

      $scope.loadSecurity();
  })

// CLIENTS
  .controller('ClientListController',function($scope, $state, popupService, $window, Client){
      $scope.clients = Client.query();

      $scope.deleteClient = function(client){
          if(popupService.showPopup('Really delete this?')){
              client.$delete(function(){
                  $window.location.href='';
              });
          }
      }
  })
  .controller('ClientViewController',function($scope,$stateParams, Client){

      $scope.client = Client.get({id:$stateParams.id});

  })
  .controller('ClientCreateController',function($scope,$state,$stateParams,Client){
      $scope.client = new Client();
      $scope.addClient = function(){
          $scope.client.$save(function(){
              $state.go('clients');
          });
      }
  })
  .controller('ClientEditController',function($scope,$state,$stateParams,Client){

      $scope.updateClient = function(){

          $scope.client.$update(function(){
              $state.go('clients');
          });
      };

      $scope.loadClient = function(){
          $scope.client = Client.get({id:$stateParams.id});
      };

      $scope.loadClient();
  })
