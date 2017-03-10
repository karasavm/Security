var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Security = mongoose.model('Security');
var Client = mongoose.model('Client');


var
  SUPERADMIN = '0',
  SECURITY_ADMIN = '1',
  SECURITY_GUARD = '2',
  CLIENT_ADMIN = '3';

exports.SUPERADMIN = SUPERADMIN;

exports.ensureAuthenticated = function(req, res, next) {
  //todo: handle with better way the failure, respond beeter json and code etc. see jwt-express
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, require('../app').get('superSecret'), function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.auth = decoded;
        console.log("DECODED AUTH", decoded);
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
};

exports.loadUsersByRole = function(req, res, next) {
  req.users = [];

  if (req.auth.role == SUPERADMIN) {
    
    User.find(function (err, data) {
      if (err) {
        return next(err);
      }
      req.users = data;
      next();
    });
  } else if (req.auth.role == SECURITY_ADMIN){
    Client.find({security: req.auth.security}, function(err, clients){
      if (err) {return next(err);}
      console.log("CLIENTS", clients)

      var client_admins = [];
      for (var i=0;i<clients.length;i++){
        client_admins.push(clients[i]._id);
      }

      User.find({$or:[ {role: req.auth.role, security: req.auth.security}, {client: {$in: client_admins}}]}, function (err, data) {
        if (err) {
          return next(err);
        }
        req.users = data;
        next();
      });
    })

  } else if (req.auth.role == CLIENT_ADMIN){
    User.find({role: req.auth.role, client: req.auth.client}, function (err, data) {
      if (err) {
        return next(err);
      }
      req.users = data;
      next();
    });
  } else {
    req.users = [];
    next();
  }
};

exports.loadSecuritiesByRole = function(req, res, next){
  
  if (req.auth.role == SUPERADMIN){
    Security.find(function (err, data) {
      if (err) {
        return next(err);
      }
      req.securities = data;
      next();
    });
  } else if (req.auth.role == SECURITY_ADMIN) {
    Security.findOne({_id: req.auth.security}, function (err, data) {
      if (err) {
        return next(err);
      }
      if (data) {
        req.securities = [data];
      } else {
        req.securities = [];
      }
      next();
    });
  } else if (req.auth.role == CLIENT_ADMIN){
    Client.findOne({_id: req.auth.client}, function (err, data){
      if (err) {return next(err);}
      if (data){
        Security.findOne({_id: data.security}, function (err, data) {
          if (err) {
            return next(err);
          }
          if (data) {
            req.securities = [data];
          } else {
            req.securities = [];
          }
          next();
        });
      }else {
        req.securities = [];
        next();
      }

    })
  }
  else {
    req.securities = [];
    next();
  }
};

exports.loadClientsByRole = function(req, res, next){

  if (req.auth.role == SUPERADMIN){
    Client.find(function (err, data) {
      if (err) {
        return next(err);
      }
      req.clients = data;
      next();
    });
  } else if (req.auth.role == SECURITY_ADMIN) {
    Client.find({security: req.auth.security}, function(err, data){
      if (err) {return next(err);}
      req.clients = data;
      next();
    })
  }else if (req.auth.role == CLIENT_ADMIN){
    Client.findOne({_id: req.auth.client}, function (err, data){
      if (err) {return next(err);}
      if (data){
        req.clients = [data];
        next();
      }else {
        req.clients = [];
        next();
      }
    })
  }
  else {
    req.clients = [];
    next();
  }
};

exports.andRestrictTo = function (role) {
  return function(req, res, next) {
    if (req.auth.role == role) {
      next();
    } else {
      next(new Error('Unauthorized')); //todo: handle with error  object, see jwt-express /lib/index.js
    }
  }
};