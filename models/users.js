var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

//todo: validation on role and security/client existence
//todo: if role something client or security should apear, and null to other one.

var
  SUPERADMIN = '0',
  SECURITY_ADMIN = '1',
  SECURITY_GUARD = '2',
  CLIENT_ADMIN = '3';
var ROLES = [SUPERADMIN, SECURITY_ADMIN, SECURITY_GUARD, CLIENT_ADMIN];

var UserSchema = new mongoose.Schema({
  
    email        : String,//, match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']},
    hash         : String,
    salt         : String,
    displayName  : String,
    role         : { type: String, enum: ROLES , required: true},
    security: {type: mongoose.Schema.Types.ObjectId, ref: 'Security'},
    client: {type: mongoose.Schema.Types.ObjectId, ref: 'Client'},
    active: {type: Boolean, default: true}
});


UserSchema.statics.validEmail = function(email) {
  return true;
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email)
};
UserSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');

  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UserSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');

  return this.hash === hash;
};

UserSchema.methods.generateJWT = function() {
  
  // set expiration to 60 days
  var today = new Date();
  
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);


  return jwt.sign({
    _id: this._id,
    role: this.role,
    displayName: this.displayName,
    email: this.email,
    security: this.security,
    client: this.client,
    active: this.active,
    exp: parseInt(exp.getTime() / 1000)
  }, require('../app').get('superSecret'));
};

mongoose.model('User', UserSchema);