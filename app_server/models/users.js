var mongoose = require("mongoose");
var bcrypt = require("bcrypt");

var photoSchema = new mongoose.Schema({
  pid: { type: String, required: true },
  caption: { type: String }
})


var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  bio: {
    type: String
  },
  followers: {
    type: [String]
  },
  following: {
    type: [String]
  },
  profilePicture: {
    type: String
  }


});

//authenticate input against database
UserSchema.statics.authenticate = function (username, password, callback) {

  console.log(username);
  console.log(password);

  User.findOne({ username: username }).exec(function (err, user) {
    if (err) {
      Console.log("error in authenticate");
      return callback(err);
    } else if (!user) {
      var err = new Error("User not found.");
      err.status = 401;
      return callback(err);
    }

    console.log(user.password);
    console.log(password);
    bcrypt.compare(password, user.password, function (err, result) {
      console.log(result);
      if (result === true) {
        return callback(null, user);
      } else {
        console.log("wrong pass");
        return callback();
      }
    });
  });
};

//hashing a password before saving it to the database
// UserSchema.pre("save", function(next) {
//   var user = this;
//   console.log("entered="+user.password);
//   bcrypt.hash(user.password, 10, function(err, hash) {
//     if (err) {
//       return next(err);
//     }
//     console.log("encrypted="+hash);
//     user.password = hash;
//     user.save();
//    next();
// //  });
// });

//mongoose.model("User", UserSchema);
var User = mongoose.model("User", UserSchema);
module.exports = User;
