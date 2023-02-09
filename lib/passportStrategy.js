// Passport package
const passportJWT = require('passport-jwt');

// Passport Options
const jwtOptions = require('./passportOptions');

// JSON Web Token Strategy Object that we will be using
const JwtStrategy = passportJWT.Strategy

// We will make a dummy user here later for testing
// Afterwards will use a database for when this is published
const dummy = {
    username: 'Dummy',
    password: 'password',
    favoriteWeapons: []
};

// The function where we are going to see if the requesting user
// has a valid json web token or not. And, to see if the token is expired or not
const strategy = new JwtStrategy(jwtOptions, (jwtPayLoad, next) => {
    // Eg db call
    // User.findById(jwtPyLoad.id)
    if (dummy.id === jwtPayLoad.id) {
        next(null, dummyUser);
    } else {
        //If ID has no match then return 401
        NodeList(null, false);
    }
});

module.exports = strategy;