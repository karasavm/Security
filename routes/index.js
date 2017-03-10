var express = require('express');
var router = express.Router();
var app = require('../app');
var jwt = require('jsonwebtoken');
var mid = require('./middleware');
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Security = mongoose.model('Security');
var Client = mongoose.model('Client');

// var jwt_auth = jwt({secret: 'SECRET', uuserProperty: 'user', requestProperty: 'auth'});



router.use('/users', [mid.ensureAuthenticated]);
router.use('/securities', [mid.ensureAuthenticated]);
router.use('/clients', [mid.ensureAuthenticated]);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// --- AUTH
router.post('/auth/register', function(req, res, next){
  if(!req.body.email || !req.body.password || !req.body.displayName || !req.body.role){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  if (!User.validEmail(req.body.email)){
    return res.status(400).json({message: 'Invalid email format'});
  }

  User.findOne({'email': req.body.email}, function(err, user){
    if (err) {return next(err);}

    if (user){
      return res.status(400).json({message: 'Email in use'});
    }

    var user = new User();

    user.email = req.body.email;
    user.setPassword(req.body.password);
    user.displayName = req.body.displayName;
    user.role = req.body.role;

    user.security = req.body.security;
    user.client = req.body.client;

    user.save(function (err, data){
      if(err){return next(err); }
      return res.json({access_token: user.generateJWT(), user: data});
    });

  });

});
router.post('/auth/login', function(req, res, next){

  if(!req.body.email || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  // custom passport callback
  passport.authenticate('local', function(err, user, info){
    
    if(err){ return next(err); }

    if(user){
      return res.json({access_token: user.generateJWT()});
    } else {

      return res.status(401).json(info);
    }
  })(req, res, next);
});


// --- USERS
router.param('userId', function(req, res, next, userId) {

  User.findOne({_id: userId}, function(err, data){

    if (err) {return next(err)};

    if (data) {
      req.user = data;
      next();
    } else {
      return res.send(404,{
        'status': 404,
        'code': null, // custom code that makes sense for your application
        'message': `User '${req.params.userId}' does not exist.'`
      });
    }
  });


});
router.get('/users', [mid.loadUsersByRole], function(req, res){

  res.json(req.users);
  
});
router.put('/users/:userId', [mid.andRestrictTo(mid.SUPERADMIN)], function(req, res, next){

  req.user.update({_id: req.user._id}, req.body, function (err, result) { // result is not the updated user
    if (err) {return next(err);}
    res.json({message: 'User updated!'}); //todo: handle it
  })

});


// --- SECURITY
router.param('securityId', function(req, res, next, securityId) {

  Security.findOne({_id: securityId}, function(err, data){

    if (err) {return next(err)};

    if (data) {
      req.security = data;
      next();
    } else {
      return res.send(404,{
        'status': 404,
        'code': null, // custom code that makes sense for your application
        'message': `Security '${securityId}' does not exist.'`
      });
    }
  });


});
router.get('/securities', [mid.loadSecuritiesByRole], function(req, res){
  res.json(req.securities);
});
router.post('/securities', [mid.andRestrictTo(mid.SUPERADMIN)], function(req, res, next){

  var security = Security({
    name: req.body.name
  });

  security.save(function(err, data){
    if (err) {return next(err);}
    res.json(data);
  });

});
router.put('/securities/:securityId', [mid.andRestrictTo(mid.SUPERADMIN)], function(req, res, next){
  req.security.update({_id: req.security._id}, req.body, function (err, result) { // result is not the updated security
    if (err) {return next(err);}
    res.json({message: 'Security updated!'}); //todo: handle it
  })

});

// --- CLIENT
router.param('clientId', function(req, res, next, clientId) {

  Client.findOne({_id: clientId}, function(err, data){

    if (err) {return next(err)};

    if (data) {
      req.client = data;
      next();
    } else {
      return res.send(404,{
        'status': 404,
        'code': null, // custom code that makes sense for your application
        'message': `Client '${clientId}' does not exist.'`
      });
    }
  });


});
router.get('/clients', [mid.loadClientsByRole], function(req, res){
  res.json(req.clients);
});
router.post('/clients', [mid.andRestrictTo(mid.SUPERADMIN)], function(req, res, next){

    var client = Client({
      name: req.body.name,
      security: req.body.security
    });


    client.save(function(err, data){
      if (err) {return next(err);}
      res.json(data);
    });

  });
router.put('/clients/:clientId', [mid.andRestrictTo(mid.SUPERADMIN)], function(req, res, next){
  req.client.update({_id: req.client._id}, req.body, function (err, result) { // result is not the updated client
    if (err) {return next(err);}
    res.json({message: 'Client updated!'}); //todo: handle it
  })

});




module.exports = router;
