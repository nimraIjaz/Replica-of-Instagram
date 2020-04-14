var mongoose = require("mongoose");
var User = mongoose.model("User");
var UserDp = mongoose.model("User");
var photo = mongoose.model("photos");
var story = mongoose.model("stories");

var sendJSONresponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};


module.exports.viewEdit = function (req, res) {
  if (req.session && req.session.userId) {
    console.log("Session Active");
    res.render('editProfile', {
      displayPicture: "/images/" + req.session.profilePic,
      currentUser: req.session.userName,
      currentBio: req.session.myInfo
    })
    next();
  } else {
    console.log("No session Active");
    var err = new Error("You must be logged in to view this page.");
    err.status = 401;
    res.redirect("/");
  }
}

module.exports.editThis = function (req, res) {

  User.findByIdAndUpdate(req.session.userId, {
    $set: { bio: req.body.bio, profilePicture: req.file.filename }
  },
    { upsert: true },
    function (err, location) {
      if (err) return res.status(500).send(err);
      res.redirect("/edit");
    });

}

module.exports.followers = function (req, res) {
  if (req.session && req.session.userId) {
    User.findById(req.session.userId).exec(function (err, currentuser) {
      if (!currentuser) {
        console.log('no such user found');
        sendJSONresponse(res, 404, {
          message: "user not found"
        });
        return;
      } else if (err) {
        console.log(err);
        sendJSONresponse(res, 404, err);
        return;
      }
      UserDp.find({ _id: currentuser.followers }).exec(function (err, userprofile) {
        if (!userprofile) {
          console.log('no such user found');
          sendJSONresponse(res, 404, {
            message: "user not found"
          });
          return;
        } else if (err) {
          console.log(err);
          sendJSONresponse(res, 404, err);
          return;
        }
        console.log(currentuser);

        // userfollower:currentuser.followers , 
        //   dp:userprofile.profilePicture
        // sendJSONresponse(res, 200, currentuser);
        res.render("followers", {
          userfollower: userprofile
        });
      });

    });
  } else {
    console.log("No userid specified");
    sendJSONresponse(res, 404, {
      message: "No userid in request"
    });
  }
};


module.exports.following = function (req, res) {
  if (req.session && req.session.userId) {
    User.findById(req.session.userId).exec(function (err, currentuser) {
      if (!currentuser) {
        console.log('no such user found');
        sendJSONresponse(res, 404, {
          message: "user not found"
        });
        return;
      } else if (err) {
        console.log(err);
        sendJSONresponse(res, 404, err);
        return;
      }
      UserDp.find({ _id: currentuser.following }).exec(function (err, userprofile) {
        if (!userprofile) {
          console.log('no such user found');
          sendJSONresponse(res, 404, {
            message: "user not found"
          });
          return;
        } else if (err) {
          console.log(err);
          sendJSONresponse(res, 404, err);
          return;
        }
        console.log(currentuser);

        // userfollower:currentuser.followers , 
        //   dp:userprofile.profilePicture
        // sendJSONresponse(res, 200, currentuser);
        res.render("following", {
          userfollower: userprofile
        });
      });

    });
  } else {
    console.log("No userid specified");
    sendJSONresponse(res, 404, {
      message: "No userid in request"
    });
  }
};


module.exports.locationsDeleteOne = function (req, res) {

  if (req.session.id) {
    Loc.findByIdAndRemove(locationid).exec(function (err, location) {
      if (err) {
        console.log(err);
        sendJSONresponse(res, 404, err);
        return;
      }
      console.log("Location id " + locationid + " deleted");
      sendJSONresponse(res, 204, null);
    });
  } else {
    sendJSONresponse(res, 404, {
      message: "No locationid"
    });
  }
};

module.exports.postReadOne = function (req, res) {
  console.log("Finding post details", req.params);
  console.log("my post id" + req.params.postid)
  if (req.params && req.params.postid) {
    photo.findById(req.params.postid).exec(function (err, location) {
      if (!location) {
        sendJSONresponse(res, 404, {
          message: "locationid not found"
        });
        return;
      } else if (err) {
        console.log(err);
        sendJSONresponse(res, 404, err);
        return;
      }
      // console.log(location);
      // sendJSONresponse(res, 200, location);
      console.log("my location photo" + location)
      res.render('post', { myPost: location })
    });
  } else {
    console.log("No locationid specified");
    sendJSONresponse(res, 404, {
      message: "No locationid in request"
    });
  }
};

module.exports.postDeleteOne = function (req, res) {
  var myPostID = req.params.postid;
  if (myPostID) {
    photo.findByIdAndRemove(myPostID).exec(function (err, location) {
      console.log("to be deleted post" + location);
      if (err) {
        console.log(err);
        sendJSONresponse(res, 404, err);
        return;
      }
      console.log("Post id " + myPostID + " deleted");
      res.redirect("/profile");
      //sendJSONresponse(res, 204, null);
    });
  } else {
    sendJSONresponse(res, 404, {
      message: "No postid"
    });
  }
};

module.exports.myEditPost = function (req, res) {
  console.log("Finding post details", req.params);
  console.log("my post id" + req.params.postid)
  if (req.params && req.params.postid) {
    photo.findById(req.params.postid).exec(function (err, location) {
      if (!location) {
        sendJSONresponse(res, 404, {
          message: "locationid not found"
        });
        return;
      } else if (err) {
        console.log(err);
        sendJSONresponse(res, 404, err);
        return;
      }
      // console.log(location);
      // sendJSONresponse(res, 200, location);
      console.log("my location photo" + location)
      res.render("editCaption", { myPost: location })

    });
  } else {
    console.log("No locationid specified");
    sendJSONresponse(res, 404, {
      message: "No locationid in request"
    });
  }

};


module.exports.postUpdate = function (req, res) {
  if (!req.params.postid) {
    sendJSONresponse(res, 404, {
      message: "Not found, postid is required"
    });
    return;
  }
  photo.findById(req.params.postid)

    .exec(function (err, location) {
      console.log("need to update " + location.caption);
      if (!location) {
        sendJSONresponse(res, 404, {
          message: "postid not found"
        });
        return;
      } else if (err) {
        sendJSONresponse(res, 400, err);
        return;
      }
      location.caption = req.body.caption;
      console.log("caption is " + location.caption);

      location.save(function (err, location) {
        if (err) {
          sendJSONresponse(res, 404, err);
        } else {
          //sendJSONresponse(res, 200, location);
          res.redirect("/post/" + req.params.postid);
        }
      });
    });
}



module.exports.loadProfile = function requiresLogin(req, res, next) {

  if (req.session && req.session.userId) {
    console.log("Session Active");

    photo.find({ id: req.session.userId }, function (error, usera) {
      console.log(usera + "mmm")
      if (!usera) {
        console.log("error");

        return;
      } else if (error) {
        console.log("big eerr");
        return;

      }

      story.find({ id: req.session.userId }, function (error, userStory) {
        console.log(userStory + "musermm")
        if (!userStory) {
          console.log("error");

          return;
        } else if (error) {
          console.log("big eerr");
          return;

        }
        let myResult = userStory.map(a => a.pid);
        console.log("let'see story" + myResult)
        //console.log("allpids"+userStory.pid);
        res.render('profile', {
          displayPicture: "/images/" + req.session.profilePic,
          username: req.session.userName,
          bio: req.session.myInfo,
          uploads: usera
        })
      })
    })

    //  next();
  } else {
    console.log("No Session Active");
    var err = new Error("You must be logged in to view this page.");
    err.status = 401;
    res.redirect("/");
  }
};

module.exports.commentUpdate = function (req, res) {
  if (!req.params.postid) {
    sendJSONresponse(res, 404, {
      message: "Not found, postid is required"
    });
    return;
  }
  photo.findById(req.params.postid)

    .exec(function (err, location) {
      console.log("need to update " + location.comments);
      if (!location) {
        sendJSONresponse(res, 404, {
          message: "postid not found"
        });
        return;
      } else if (err) {
        sendJSONresponse(res, 400, err);
        return;
      }
      location.comments.push(req.body.comment);
      console.log("caption is " + location.comments);

      location.save(function (err, location) {
        if (err) {
          sendJSONresponse(res, 404, err);
        } else {
          //sendJSONresponse(res, 200, location);
          res.redirect("/post/" + req.params.postid);
        }
      });
    });
}



module.exports.checkLogin = function requiresLogin(req, res, next) {

  if (req.session && req.session.userId) {
    console.log("Session Active");

    next();
  } else {
    console.log("No Session Active");
    var err = new Error("You must be logged in to view this page.");
    err.status = 401;
    res.redirect("/");
  }
};


module.exports.storyReadOne = function (req, res) {
  console.log("Finding story details", req.params);
  console.log("my story id" + req.params.storyid)
  if (req.params && req.params.storyid) {
    story.findById(req.params.storyid).exec(function (err, location) {
      if (!location) {
        sendJSONresponse(res, 404, {
          message: "storyid not found"
        });
        return;
      } else if (err) {
        console.log(err);
        sendJSONresponse(res, 404, err);
        return;
      }
      console.log("my location story" + location)
      res.render('story', { myStory: location })
    });
  } else {
    console.log("No storyid specified");
    sendJSONresponse(res, 404, {
      message: "No storyid in request"
    });
  }
};

module.exports.storyDeleteOne = function (req, res) {
  var mystoryID = req.params.storyid;
  if (mystoryID) {
    story.findByIdAndRemove(mystoryID).exec(function (err, location) {
      console.log("to be deleted post" + location);
      if (err) {
        console.log(err);
        sendJSONresponse(res, 404, err);
        return;
      }
      console.log("story id " + mystoryID + " deleted");
      res.redirect("/feed");
      //sendJSONresponse(res, 204, null);
    });
  } else {
    sendJSONresponse(res, 404, {
      message: "No storyid"
    });
  }
};

module.exports.viewProfile = function (req, res) {
  console.log("Finding profile details", req.params);
  console.log("my profile id" + req.params.profileid)
  if (req.params && req.params.profileid) {
    User.findById(req.params.profileid).exec(function (err, location) {
      if (!location) {
        sendJSONresponse(res, 404, {
          message: "profileid not found"
        });
        return;
      } else if (err) {
        console.log(err);
        sendJSONresponse(res, 404, err);
        return;
      }

      photo.find({ id: req.params.profileid }).exec(function (err, loc1) {
        if (!loc1) {
          sendJSONresponse(res, 404, {
            message: "photoid not found"
          });
          return;
        } else if (err) {
          console.log(err);
          sendJSONresponse(res, 404, err);
          return;
        }

        console.log("my location profile" + location)
        res.render('otherProfile', {
          otherProfileUser: location,
          username: location.username,
          displayPicture: location.profilePicture,
          inform: location.bio,
          uploads: loc1,
          myid: location._id
        })
      });
    });
  } else {
    console.log("No profileid specified");
    sendJSONresponse(res, 404, {
      message: "No profileid in request"
    });
  }
};

module.exports.userFollow = function (req, res) {
  console.log("Finding follower details", req.params);
  console.log("my follow id" + req.params.profileid)
  if (req.params && req.params.profileid) {
    User.findByIdAndUpdate(req.session.userId, {
      $push: { following: req.params.profileid }
    },
      { upsert: true },
      function (err, location) {
        if (err) return res.status(500).send(err);
        User.findByIdAndUpdate(req.params.profileid, {
          $push: { followers: req.session.userId }
        },
          { upsert: true },
          function (errr, locations) {
            if (errr) return res.status(500).send(errr);
            res.redirect("/profile/" + req.params.profileid);
          });
      });
  }
};


module.exports.deleteFollow = function (req, res) {

  if (req.params && req.params.profileid) {

    User.findByIdAndUpdate(req.session.userId,
      { $pull: { following: req.params.profileid } },
      { upsert: true },
      function (err, doc) {
        if (err) return res.status(500).send(err);

        User.findByIdAndUpdate(req.params.profileid,
          { $pull: { followers: req.session.userId } },
          { upsert: true },
          function (err, doc) {
            if (err) return res.status(500).send(err);

            res.redirect("/profile/" + req.params.profileid);

          });
      });
  }
};

module.exports.postOtherView = function (req, res) {
  console.log("Finding other post details", req.params);
  console.log("other post id" + req.params.postid)
  if (req.params && req.params.postid) {
    photo.findById(req.params.postid).exec(function (err, location) {
      if (!location) {
        sendJSONresponse(res, 404, {
          message: "other postid not found"
        });
        return;
      } else if (err) {
        console.log(err);
        sendJSONresponse(res, 404, err);
        return;
      }
      // console.log(location);
      // sendJSONresponse(res, 200, location);
      console.log("other post id" + location)
      res.render('otherPost', { myPost: location })
    });
  } else {
    console.log("No locationid specified");
    sendJSONresponse(res, 404, {
      message: "No locationid in request"
    });
  }
};

module.exports.commentUpdateOther = function (req, res) {
  if (!req.params.postid) {
    sendJSONresponse(res, 404, {
      message: "Not found, postid is required"
    });
    return;
  }
  photo.findById(req.params.postid)

    .exec(function (err, location) {
      console.log("need to update " + location.comments);
      if (!location) {
        sendJSONresponse(res, 404, {
          message: "postid not found"
        });
        return;
      } else if (err) {
        sendJSONresponse(res, 400, err);
        return;
      }
      location.comments.push(req.body.comment);
      console.log("caption is " + location.comments);

      location.save(function (err, location) {
        if (err) {
          sendJSONresponse(res, 404, err);
        } else {
          //sendJSONresponse(res, 200, location);
          res.redirect("/otherPost/" + req.params.postid);
        }
      });
    });
};

module.exports.storyReadOther = function (req, res) {
  console.log("Finding other story details", req.params);
  console.log("my story id" + req.params.storyid)
  if (req.params && req.params.storyid) {
    story.findById(req.params.storyid).exec(function (err, location) {
      if (!location) {
        sendJSONresponse(res, 404, {
          message: "other storyid not found"
        });
        return;
      } else if (err) {
        console.log(err);
        sendJSONresponse(res, 404, err);
        return;
      }
      console.log("my location other story" + location)
      res.render('otherStory', { myStory: location })
    });
  } else {
    console.log("No other storyid specified");
    sendJSONresponse(res, 404, {
      message: "No other storyid in request"
    });
  }
}

module.exports.otherFollowers = function (req, res) {
  if (req.params && req.params.profileid) {
    User.findById(req.params.profileid).exec(function (err, currentuser) {
      if (!currentuser) {
        console.log('no such user found');
        sendJSONresponse(res, 404, {
          message: "user not found"
        });
        return;
      } else if (err) {
        console.log(err);
        sendJSONresponse(res, 404, err);
        return;
      }
      UserDp.find({ _id: currentuser.followers }).exec(function (err, userprofile) {
        if (!userprofile) {
          console.log('no such user found');
          sendJSONresponse(res, 404, {
            message: "user not found"
          });
          return;
        } else if (err) {
          console.log(err);
          sendJSONresponse(res, 404, err);
          return;
        }
        console.log(currentuser);
        res.render("followers", {
          userfollower: userprofile
        });
      });

    });
  } else {
    console.log("No userid specified");
    sendJSONresponse(res, 404, {
      message: "No userid in request"
    });
  }
};

module.exports.otherFollowing = function (req, res) {
  if (req.params && req.params.profileid) {
    User.findById(req.params.profileid).exec(function (err, currentuser) {
      if (!currentuser) {
        console.log('no such user found');
        sendJSONresponse(res, 404, {
          message: "user not found"
        });
        return;
      } else if (err) {
        console.log(err);
        sendJSONresponse(res, 404, err);
        return;
      }
      UserDp.find({ _id: currentuser.following }).exec(function (err, userprofile) {
        if (!userprofile) {
          console.log('no such user found');
          sendJSONresponse(res, 404, {
            message: "user not found"
          });
          return;
        } else if (err) {
          console.log(err);
          sendJSONresponse(res, 404, err);
          return;
        }
        console.log(currentuser);

        // userfollower:currentuser.followers , 
        //   dp:userprofile.profilePicture
        // sendJSONresponse(res, 200, currentuser);
        res.render("following", {
          userfollower: userprofile
        });
      });

    });
  } else {
    console.log("No userid specified");
    sendJSONresponse(res, 404, {
      message: "No userid in request"
    });
  }

};