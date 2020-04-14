var mongoose = require("mongoose");

//var dbURI = "mongodb://localhost:27017/Loc8r";
var dbURI = "mongodb+srv://nimraIjaz:loc8rNimra@loc8r-vh8qz.mongodb.net/test?retryWrites=true&w=majority";

//var dbURI="mongodb://meharfatima:12345678w@ds145563.mlab.com:45563/instagram";
if (process.env.NODE_ENV === "production") {
    // mongo ds145563.mlab.com:45563/instagram -u meharfatima -p 12345678w
    //dbURI = "mongodb://meharfatima:12345678w@ds145563.mlab.com:45563/instagram";
    dbURI="mongodb+srv://nimraIjaz:loc8rNimra@loc8r-vh8qz.mongodb.net/test?retryWrites=true&w=majority"
    //   mongodb://<dbuser>:<dbpassword>@ds145563.mlab.com:45563/instagram
}
mongoose.connect(
    dbURI,
    { useNewUrlParser: true }
);

//connecting

// var dbURI= "mongodb://localhost:27017/Loc8r";
// mongoose.connect(dbURI,{useNewUrlParser: true }); 

mongoose.connection.on("connected", function () {
    console.log('Mongoose connected to ' + dbURI);
})

mongoose.connection.on("error", function () {
    console.log('Mongoose connection error ' + console.error());

})

mongoose.connection.on("disconnected", function () {
    console.log('Mongoose disconnected from ' + dbURI);
})


//disconnecting

var gracefulShutdown = function (msg, callback) {

    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through' + msg);
        callback();
    })
}

process.once('SIGUSR2', function () {
    gracefulShutdown('nodemon restart', function () {
        process.kill(process.pid, "SIGUSR2");
    })
})

process.on('SIGINT', function () {
    gracefulShutdown('app termination', function () {
        process.exit(0);
    })
})


process.on('SIGTERM', function () {
    gracefulShutdown('Heroku app shutdown', function () {
        process.exit(0);
    })
})

var user = require('./members');
var abcd = require('./posts');
require('./users');
require('./photo');
require('./story');
