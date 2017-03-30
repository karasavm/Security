var mongoose = require('mongoose');



var Schema = new mongoose.Schema({
  name: {type: String, unique: true, required: true},
  security: {type: mongoose.Schema.Types.ObjectId, ref: 'Security', required: false}
});


mongoose.model('Client', Schema);
// --------------------------------



