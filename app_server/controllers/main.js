var mongoose = require("mongoose");
var User = mongoose.model("User");
var photo = mongoose.model('photos');
var myStory = mongoose.model('stories');


module.exports.checkLogin = function requiresLogin(req, res, next) {

    if (req.session && req.session.userId) {
        console.log("Session Active");
        console.log(req.session.userId);
        console.log(req.session.profilePic);

        next();
    } else {
        console.log("No Session Active");
        var err = new Error("You must be logged in to view this page.");
        err.status = 401;
        res.redirect("/");
    }

};


module.exports.loadFeed = function requiresLogin(req, res, next) {

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
            myStory.find({ id: req.session.userId }, function (error, userStory) {
                console.log(userStory + "musermm")
                if (!userStory) {
                    console.log("error");

                    return;
                } else if (error) {
                    console.log("big eerr");
                    return;
                }

                User.find({ _id: req.session.userId }, function (error, myUser) {
                    console.log(myUser + "MY USERmusermm")
                    if (!myUser) {
                        console.log("error");

                        return;
                    } else if (error) {
                        console.log("big eerr");
                        return;
                    }

                    let myResult3 = myUser.map(a => a.following);
                    // myResult3=myUser.following;
                    console.log("my cas" + myResult3);
                    //     var j;
                    //     for (j = 0; j < myResult3.length;j++) {
                    //     photo.find({ id: myResult3[j] }).exec(function (error, otherPosts) {
                    //         console.log("this is for photo log" + myResult3[j]);
                    //         console.log(otherPosts + "otherPOSTS")
                    //         if (!otherPosts) {
                    //             console.log("error");

                    //             return;
                    //         } else if (error) {
                    //             console.log("big eerr");
                    //             return;
                    //         }
                    //         result.push(otherPosts);
                    //         console.log("folow"+result +"followpost");
                    //     });
                    // }



                    var i;
                    for (i = 0; i < myResult3.length; i++) {
                        var result;
                        photo.find({ id: myResult3[i] }).exec(function (error, otherPosts) {

                            console.log(otherPosts + "otherPOSTS")
                            if (!otherPosts) {
                                console.log("error");

                                return;
                            } else if (error) {
                                console.log("big eerr");
                                return;
                            }
                            result = otherPosts;
                            //  result.push(otherPosts);
                            console.log("folow" + result + "followpost");
                        });
                        myStory.find({ id: myResult3[i] }).exec(function (error, followStory) {

                            console.log(followStory + "museaumFOLLOW")
                            if (!followStory) {
                                console.log("error");

                                return;
                            } else if (error) {
                                console.log("big eerr");
                                return;
                            }

                            console.log("folow" + result + "followpost");
                            res.render('feed', {
                                currentUser: req.session.userName,
                                dp: [
                                    {
                                        nama: "/images/" + req.session.profilePic
                                    }

                                ],
                                allStory: followStory,
                                onlyMyStory: userStory,
                                allUploads: usera,
                                otherUploads: result

                            });

                        });
                    };
                });
            });
        });

    } else {
        console.log("No Session Active");
        var err = new Error("You must be logged in to view this page.");
        err.status = 401;
        res.redirect("/");
    }
};

module.exports.viewAll = function (req, res) {
    User.find().exec(function (err, allU) {
        if (allU) {
            // sendJSONresponse(res, 404, {
            //   message: "locations not found"
            // });
            // return;
            res.render('viewAll', { saarayUsers: allU })

        }
        else {
            console.log(err);
            sendJSONresponse(res, 404, err);
            return;
        }
    });
}