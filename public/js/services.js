/**
 * Created by Sandeep on 01/06/14.
 */

angular.module('securityApp.services',[])
  .factory('User',function($resource){
      return $resource('http://localhost:3000/users/:id',{id:'@_id'},{
          update: {
              method: 'PUT'
          }
      });
  })
  .factory('Security',function($resource){
      return $resource('http://localhost:3000/securities/:id',{id:'@_id'},{
          update: {
              method: 'PUT'
          }
      });
  })
  .factory('Client',function($resource){
      return $resource('http://localhost:3000/clients/:id',{id:'@_id'},{
          update: {
              method: 'PUT'
          }
      });
  })
  .service('popupService',function($window){
    this.showPopup=function(message){
        return $window.confirm(message);
    }
});