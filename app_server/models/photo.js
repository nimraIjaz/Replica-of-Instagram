
var mongoose = require("mongoose");

var photoSchema = new mongoose.Schema({
  pid: { type: String, required: true },
  caption: { type: String },
  name: { type: String },
  id: { type: String },
  comments: [{ type: String }]

})

var postC = mongoose.model("photos", photoSchema);
module.exports = postC
