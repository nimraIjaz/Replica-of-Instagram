var request = require("request");

var mongoose = require("mongoose");
var User = mongoose.model("User");
var bcrypt = require('bcryptjs');


module.exports.signUp = function (req, res) {
    res.render('signUp');
}
module.exports.createAccount = function (req, res) {
    // res.render('signUp', { 
    // title:"SignUp"});
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    var bio = req.body.bio;
    var profilePicture;

    console.log(username);
    console.log(password);
    console.log(req.file);

    if (req.file) {
        console.log('Uploading file..');
        profilePicture = req.file.filename;
    }
    else {
        console.log('No file uploaded..');
        profilePicture = "blankProfile.png";
    }
    req.checkBody('username', 'Username field is required').notEmpty();
    req.checkBody('password', 'Password field is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    req.checkBody('password', 'Password must be atleast5 characterslong!').isLength({ min: 5, max: 25 });

    var errors = req.validationErrors();
    if (errors) {
        //console.log('Errors');
        res.render('signUp',
            {
                errors: errors
            });
    }
    else {
        // console.log('No errors');

        var newuser = new User();
        newuser.username = username;
        newuser.password = password;
        newuser.profilePicture = profilePicture;

        newuser.bio = bio;
        bcrypt.hash(newuser.password, 10, function (err, hash) {
            if (err) {
                return next(err);
            }
            console.log("encrypted=" + hash);
            newuser.password = hash;


            newuser.save(function (err, savedUser) {
                if (err) throw err;
                console.log(savedUser);
            });
        })
        req.flash('success', 'You are now successfully registered and can login!');
        res.location('/');
        res.redirect('/');
    }

};

module.exports.validatigUserName = function (req, res) {
    var input = req.param('val');
    console.log("input is " + input);

    User.find({ username: input }).exec(function (err, user) {
        console.log("asdas");
        if (err) {
            Console.log("error in getting value");
            res.json(null);
        } else if (!user || user === undefined || user.length <= 0) {
            //var err = new Error("User not found.");
            //err.status = 401;
            res.json(null);
        }
        else {
            console.log("finding uswe" + user);
            res.json(user);
            // return;
        }
    })
}

