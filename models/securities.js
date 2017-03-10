var mongoose = require('mongoose');



var Schema = new mongoose.Schema({
  name: {type: String, unique: true, required: true}
});


mongoose.model('Security', Schema);
// --------------------------------



