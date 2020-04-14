
var mongoose = require("mongoose");
var User = mongoose.model("User");

var apiOptions = {
  server: "http://localhost:3000"
};
if (process.env.NODE_ENV === "production") {
  apiOptions.server = "https://loc8r-session.herokuapp.com";
}

var sendJSONresponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.loginCredentials = function (req, res) {
  res.render('login');
};

module.exports.loginCheck = function (req, res) {
  req.flash('success', 'You are now logged in!')
  res.redirect('/feed');
};


module.exports.doLogIn = function (req, res) {

  if (req.body.username && req.body.password) {

    User.authenticate(req.body.username, req.body.password, function (error, user) {
      if (error || !user) {
        var err = new Error("Wrong username or password.");
        err.status = 401;
        sendJSONresponse(res, 401, err);
      } else {

        console.log(user);

        console.log(user.username);

        // console.log(body);
        req.session.userId = user._id;
        req.session.userName = user.username;

        var UID = req.session.userId;
        module.exports = UID;

        var UNAME = req.session.userName;
        module.exports = UNAME;

        req.session.profilePic = user.profilePicture
        var UDP = req.session.profilePic;
        console.log("User session picture assigned: " + req.session.profilePic);
        module.exports = UDP;

        req.session.myInfo = user.bio
        var b = req.session.bio;
        console.log("User session picture assigned: " + req.session.myInfo);
        module.exports = b;
        console.log("User session id assigned: " + req.session.userId);
        //hereee

        req.flash('Success!', 'You are now successfully registered and can login!');
        // req.params.userName=req.session.userName;
        console.log("Logger's name: " + req.session.userName)
        res.location('/feed');
        res.redirect('/feed');
        //sendJSONresponse(res, 200, user);


      }

    });

  } else {
    var err = new Error("All fields required.");
    err.status = 400;

    res.redirect("/");
    sendJSONresponse(res, 400, err);
  }
};

module.exports.logout = function (req, res) {
  if (req.session) {
    console.log("Destroying session " + req.session.userId + " and " + req.session.userName);
    // delete session object
    req.session.destroy();
    res.locals.user = undefined;
    res.redirect("/");
  }
};
