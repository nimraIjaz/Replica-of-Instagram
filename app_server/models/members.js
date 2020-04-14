var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


// var photos = new mongoose.Schema({
//     pid:{ type: Number, required: true },
//     username: {type: String,required:true},
//     caption: {type: String,"default":" "},
//     photoPath: String,
//     photo_size: Number,         //size of image on server
//     uploadingDate:{ type: Date, default: Date.now }
// })



var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: 'Full name can\'t be empty',
        unique: true
    },
    password: {
        type: String,
        required: 'Password can\'t be empty',
        minlength: [4, 'Password must be atleast 4 character long']
    },
    profilePicture: {
        type: String,
    },
    // bio: {type: String,"default":" "},
    // noOfPosts: { type: Number, "default":0 },
    // noofFollowers: { type: Number, "default":0 },
    // noOfUsersFollowing: { type: Number, "default":0 },
    // posts: [photos],
    // followedBy: [Number],
    // followingUsers: [Number]

})

var User = module.exports = mongoose.model('members', userSchema);
module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
};

module.exports.getUserByUsername = function (username, callback) {
    var query = { username: username };
    User.findOne(query, callback);
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        callback(null, isMatch);
    });
}

module.exports.createUser = function (newUser, callback) {
    newUser.save(callback);
}

