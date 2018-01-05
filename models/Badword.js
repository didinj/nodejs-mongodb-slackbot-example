var mongoose = require('mongoose');

var BadwordSchema = new mongoose.Schema({
  user_id: String,
  keyword: String,
  receive_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Badword', BadwordSchema);
