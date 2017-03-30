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
var Checkpoint = mongoose.model('Checkpoint');
var path = require('path');
var fs = require('fs');
var formidable = require('formidable');
// var jwt_auth = jwt({secret: 'SECRET', uuserProperty: 'user', requestProperty: 'auth'});



router.use('/users', [mid.ensureAuthenticated]);
router.use('/securities', [mid.ensureAuthenticated]);
router.use('/clients', [mid.ensureAuthenticated]);
router.use('/checkpoints', [mid.ensureAuthenticated]);

var path = require('path');

// router.get('*', function(req, res, next) {
//   // return res.sendFile('/admin.html');
//   // return res.sendFile(path.join(__dirname+'/../../ng-admin-demo/index.html'));
//   return res.sendFile(path.join(__dirname+'/../public/index.html'));
// });
router.get('/_login', function(req, res, next) {
  // return res.sendFile('/admin.html');
  // return res.sendFile(path.join(__dirname+'/../../ng-admin-demo/index.html'));
  return res.sendFile(path.join(__dirname+'/../public/login.html'));
});

/* GET home page. */
router.get('/', function(req, res, next) {
  return res.sendFile(path.join(__dirname + '/../index.html'));
  res.send('ok');}
);


// --- AUTH
router.post('/users', function(req, res, next){
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

//todo: transfer outside of routes the middlewares

// --- USERS
router.param('userId', mid.loadUserById);
router.get('/users', mid.loadUsersByRole);

router.put('/users/:userId', [mid.andRestrictTo(mid.SUPERADMIN)], mid.updateUserById);
router.get('/users/:userId', [mid.andRestrictTo(mid.SUPERADMIN)], function (req, res) {
  res.json(req.user)
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
  Security.findOneAndUpdate({_id: req.security._id}, req.body, function (err, result) { // result is not the updated security
    if (err) {return next(err);}

    res.json({message: 'Security updated!'}); //todo: handle it
  })

});
router.get('/securities/:securityId', [mid.andRestrictTo(mid.SUPERADMIN)], function(req, res, next){
  res.json(req.security)

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
  Client.findOneAndUpdate({_id: req.client._id}, req.body, function (err, result) { // result is not the updated client
    if (err) {return next(err);}
    res.json({message: 'Client updated!'}); //todo: handle it
  })

});
router.get('/clients/:clientId', [mid.andRestrictTo(mid.SUPERADMIN)], function(req, res, next){
  res.json(req.client);
});


// -- CHECKPOINTS
router.post('/checkpoints', [mid.andRestrictTo(mid.SECURITY_GUARD)], function (req, res, next) {
  var body = req.body;
  body.created_by = req.auth._id;

  var checkpoint = new Checkpoint(body);


  checkpoint.save(function(err, data){
    if (err) {return next(err);}

    data.photos_uri = "/checkpoints/"+data._id+"/photos";
    res.json(data);
  });
});



router.post('/checkpoints/:checkpoint_id/photos', [mid.andRestrictTo(mid.SECURITY_GUARD)], function(req, res){

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  // form.multiples = true;

  // store all uploads in the /{checkpoint_id}/uploads directory
  var img_path = path.join(__dirname, './../uploads/'+req.params.checkpoint_id);
  // img_path = path.join(__dirname, './../uploads/');
  if (!fs.existsSync(img_path)){
    fs.mkdirSync(img_path);
  }
  form.uploadDir = img_path;

  //todo: when no file exists what to do
  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    console.log("on file")
    fs.rename(file.path, path.join(form.uploadDir, file.name));
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
    res.json({success: false, error: err})
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.json({success: true, message: 'Photo uploaded with success'});
  });

  // parse the incoming request containing the form data
  form.parse(req);

});

router.get('/checkpoints/:checkpoint_id/photos', [mid.andRestrictTo(mid.SECURITY_GUARD)], function(req, res, next){
  const testFolder = path.join(__dirname, './../uploads/'+req.params.checkpoint_id)

  fs.readdir(testFolder, function(err, files) {
    console.log(files)
    if (!files)
      files = []
    res.json({photos: files})
  })

})

module.exports = router;

