require('dotenv').config()
const passportJWT = require('passport-jwt');
const ExtractJwt = passportJWT.ExtractJwt;
const jwtOptions = {};

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.SUPER_SECRET_KEY;
jwtOptions.refreshSecret = process.env.REFRESH_TOKEN_SECRET;
// To be added to .env file

module.exports = jwtOptions;