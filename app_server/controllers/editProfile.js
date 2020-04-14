var mongoose = require("mongoose");
var User = mongoose.model("User");

var bcrypt = require('bcryptjs');

var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};


module.exports.edit = function (req, res) {
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

var logout = function (req, res) {
    if (req.session) {
        console.log("destroying session " + req.session.userId);
        // delete session object
        req.session.destroy();
        res.locals.user = undefined;
        res.redirect("/");
    }
}

module.exports.deleteAccount = function (req, res) {

    var UID = req.session.userId;
    console.log(UID);

    if (UID) {

        User.findByIdAndRemove(UID).exec(function (err, user) {
            if (err) {
                console.log(err);
                sendJSONresponse(res, 404, err);
                return;
            }
            console.log("User id " + UID + " deleted");

            console.log(req.session.userId);
            logout(req, res);

        });
    } else {
        sendJSONresponse(res, 404, {
            message: "No userid"
        });



    }

}

module.exports.del = function (req, res) {
    res.render('deleteForm');
    //var username=re
}

module.exports.updateProfile = function (req, res) {
    if (!req.session.userId && !req.session) {
        sendJSONresponse(res, 404, {
            message: "Not found, userId is required"
        });
        return;
    }
    User.findById(req.session.userId)
        .exec(function (err, user) {
            if (!user) {
                sendJSONresponse(res, 404, {
                    message: "userid not found"
                });
                return;
            } else if (err) {
                sendJSONresponse(res, 400, err);
                return;
            }
            user.bio = req.body.bio;
            console.log(req.body.password1 + "asdfghj");

            user.profilePicture = req.file.filename;
            req.checkBody('password2', 'Passwords do not match').equals(req.body.password1);
            req.session.profilePic = req.file.filename;

            var errors = req.validationErrors();
            if (errors) {
                //console.log('Errors');
                res.render('editProfile',
                    {
                        errors: errors
                    });
            }
            else {
                if (req.body.password1.length > 0) {
                    user.password = req.body.password1;
                    bcrypt.hash(user.password, 10, function (err, hash) {
                        if (err) {
                            return next(err);
                        }
                        console.log("encrypted=" + hash);
                        user.password = hash;

                        user.save(function (err, user) {
                            if (err) {

                                sendJSONresponse(res, 404, err);
                            } else {
                                res.render("editProfile", {
                                    displayPicture: "/images/" + req.file.filename,
                                    currentUser: req.session.userName,
                                    currentBio: req.body.bio
                                });
                                //sendJSONresponse(res, 200, user);
                            }
                        });
                    })
                }
                else {
                    user.save(function (err, user) {
                        if (err) {

                            sendJSONresponse(res, 404, err);
                        } else {
                            res.render("editProfile", {
                                displayPicture: "/images/" + req.file.filename,
                                currentUser: req.session.userName,
                                currentBio: req.body.bio
                            });
                            //sendJSONresponse(res, 200, user);
                        }
                    });
                }

            }



        });

}

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
