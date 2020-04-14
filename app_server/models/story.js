var mongoose = require("mongoose");

var storySchema = new mongoose.Schema({
  pid: { type: String, required: true },
  name: { type: String },
  id: { type: String },
  views: [{ type: String }]

})

var storyC = mongoose.model("stories", storySchema);
module.exports = storyC
