// Passport package
const passportJWT = require('passport-jwt');
const User = require('./../models/User');
const mongoose = require('mongoose');

// Require our db config file
const db = require('./../config/db');

// Establish db connection
mongoose.connect(db, { useNewUrlParser: true } );
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
});

// Passport Options
const jwtOptions = require('./passportOptions');

// JSON Web Token Strategy Object that we will be using
const JwtStrategy = passportJWT.Strategy

// We will make a dummy user here later for testing
// Afterwards will use a database for later testing

// The function where we are going to see if the requesting user
// has a valid json web token or not. And, to see if the token is expired or not
const strategy = new JwtStrategy(jwtOptions, (jwtPayLoad, next) => {
    // Eg db call
    // User.findById(jwtPyLoad.id)
    if (User.findById(jwtPayLoad.id)) {
        next(null, User.findById(jwtPayLoad.id));
    } else {
        //If ID has no match then return 401
        NodeList(null, false);
    }
});

module.exports = strategy;