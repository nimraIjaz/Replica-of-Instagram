var mongoose = require("mongoose");
var User = mongoose.model("User");
var sendJSONresponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};



module.exports.autoComplete = function (req, res) {

  var input = req.param('val');
  console.log("input is " + input);

  User.find({ username: { "$regex": input, "$options": "i" } }).exec(function (err, user) {
    console.log("asdas");
    if (err) {
      Console.log("error in getting value");
      return;
    } else if (!user) {
      var err = new Error("User not found.");
      err.status = 401;
      return;
    }
    else {
      console.log("finding uswe" + user);
      res.json(user);
      // return;
    }
  })
  // res.json(["abs", "asdf", "adsfdd", "wertf"]);

}

module.exports.displayBio = function (req, res) {
  if (req.session.myInfo.length > 0) {
    console.log(req.session.userName);
    User.find({ username: req.session.userName }).exec(function (err, user) {
      console.log("asdas");
      if (err) {
        Console.log("error in getting value");
        return;
      } else if (!user) {
        var err = new Error("User not found.");
        err.status = 401;
        return;
      }
      else {
        console.log("finding uswe" + user);
        res.json(user);
        // return;
      }
    })
  }

  else {
    res.json(null);
  }
}