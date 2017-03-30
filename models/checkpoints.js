var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
  //todo: remove date now
  checked_at: {type: Date, required: true,},
  created_at: {type: Date, default: new Date(),},
  created_by: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  client: {type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true},

  questions: {
    is_ok: {type: Boolean}
  },


  notes: {type: String}


})
  .set('toJSON', {setter: true, getter:true, virtuals: true });

Schema.virtual('photos_uri').get(function() {
  return this._photos_uri;
});
Schema.virtual('photos_uri').set(function(v) {
  this._photos_uri = v;
});
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OGMyYTZkMDhlZGU4MjFkOTg1ZTY2ZTQiLCJyb2xlIjoiMiIsImRpc3BsYXlOYW1lIjoiU0VDVVJJVFlfR1VBUkQiLCJlbWFpbCI6ImthcmFzYXZtQGdtYWlsLmNvbTQiLCJzZWN1cml0eSI6IjU4YzJhMmFjYzRhZGY3MzdlY2YzMzRmNiIsImFjdGl2ZSI6dHJ1ZSwiZXhwIjoxNDk2MDAxMTQxLCJpYXQiOjE0OTA4MTcxNDF9.BEng-Fej71uCAzDmDGlprWATkCBUDS94M_SEfCVO4ms

mongoose.model('Checkpoint', Schema);