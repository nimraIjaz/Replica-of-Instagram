var mongoose = require("mongoose");
var User = mongoose.model("User");
var photo = mongoose.model("photos");
var myStory = mongoose.model('stories');
var sendJSONresponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};



module.exports.allUploads = function (req, res) {
  res.render('upload');
}

module.exports.postCreate = function (req, res) {
  photo.create(
    {
      pid: req.file.filename,
      caption: req.body.caption,
      name: req.session.userName,
      id: req.session.userId
    },
    function (err, review) {
      if (err) {
        console.log(err);
        return;
      } else {
        console.log(review);
        res.redirect("/feed");
      }
    }
  );
};

module.exports.storyCreate = function (req, res) {
  myStory.create(
    {
      pid: req.file.filename,
      name: req.session.userName,
      id: req.session.userId
    },
    function (err, review) {
      if (err) {
        console.log(err);
        return;
      } else {
        console.log(review);
        res.redirect("/feed");
      }
    }
  );
};

module.exports.checkLogin = function requiresLogin(req, res, next) {

  if (req.session && req.session.userId) {
    console.log("Session Active");

    //  next();
  } else {
    console.log("No Session Active");
    var err = new Error("You must be logged in to view this page.");
    err.status = 401;
    res.redirect("/");
  }
};
  // module.exports.postCreate = function (req, res) {
  //     // this.checkLogin(req,res);
  //   if (req.session.userId) {
  //     User.findById(req.session.userId)
  //       .select("posts")
  //       .exec(function (err, location) {
  //         if (err) {
  //           sendJSONresponse(res, 400, err);
  //         } else {
  //           doAddPOST(req, res, location);
  //         }
  //       });
  //   } else {
  //     sendJSONresponse(res, 404, {
  //       message: "Not found, id required"
  //     });
  //   }
  // };

  // var doAddPOST = function (req, res, location) {
  //   if (!location) {
  //     sendJSONresponse(res, 404, "locationid not found");
  //   } else {
  //     console.log("In add review " + req.session.userId);
  //     console.log(res.locals.user);
  //     var postPhoto;
  //     if (req.file) {
  //       console.log('Uploading file..');
  //       postPhoto = req.file.filename;
  //     }
  //     else {
  //       console.log('No file uploaded..');
  //       postPhoto = "blankProfile.png";
  //     }
  // //  var postPhoto=req.file.filename;
  // console.log("this is my caption "+req.body.caption);
  //   console.log(postPhoto)
  //   console.log("my info first"+ location)
  //   // var u= new Pic({"pid":postPhoto,
  //   //   "caption":req.body.caption});
  //    // console.log("this is variable "+u);
  // location.posts= {"pid":postPhoto,
  // "caption":req.body.caption};
  // console.log("this is real after  wowow"+location);
  //     // location.posts.create(
  //     //       {
  //     //         pid: postPhoto,
  //     //         caption: req.body.caption,


  //     //       });
  //     // create a comment
  //     location.posts.push({"pid":postPhoto,
  //     "caption":req.body.caption});

  //     location.save(function (err,location) {
  //       var thisPost;
  //       //if (err) console.log(err);
  //      // thisPost = location.posts[location.posts.length - 1];
  //       console.log('Success!');
  //       res.redirect("/feed");
  //       //sendJSONresponse(res, 201, thisPost);
  //     });

  //   }
  // };


  // module.exports.locationsReadOne = function(req, res) {
  //   console.log("Finding location details", req.sessioj);
  //   if (req.session && req.session.userId) {
  //     photo.findById(req.session.userId).exec(function(err, location) {
  //       if (!location) {
  //         sendJSONresponse(res, 404, {
  //           message: "locationid not found"
  //         });
  //         return;
  //       } else if (err) {
  //         console.log(err);
  //         sendJSONresponse(res, 404, err);
  //         return;
  //       }
  //       console.log(location);
  //       sendJSONresponse(res, 200, location);
  //     });
  //   } else {
  //     console.log("No locationid specified");
  //     sendJSONresponse(res, 404, {
  //       message: "No locationid in request"
  //     });
  //   }
  // };
