// Require the necessary NPM packages
const express = require('express');
const mongoose = require('mongoose');

// Require the Authentication packages
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Require passport strat + opt
const jwtOptions = require('./../lib/passportOptions');

// Require our db config file
const db = require('./../config/db');

// Establish db connection
mongoose.connect(db, { useNewUrlParser: true } );
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
});

// Require Mongoose Model for User
const User = require('./../models/User');
const { application } = require('express');

// Instantiate a Router (mini app that only handles routes)
const router = express.Router();

//Generate Access Token Function
const getAccessToken = (user) => {
    // Select the information we want to send to the user.
    const payload = {
        id: user._id
    };
    // Build a JSON Web Token using the payload - This will last 300 seconds
    const accessToken = jwt.sign(payload, jwtOptions.secretOrKey, { expiresIn: 61 });
    const refreshToken = jwt.sign(payload, jwtOptions.refreshSecret);
    // Find out a way to store the refresh token
    return {accessToken, refreshToken}
}

router.post('/api/login', (req, res) => {
    // First check both a username + password has been entered
    if (req.body.username && req.body.password) {
        // Check if there is a user with the entered username
        // Get password and then run bcrypt
        User.findOne({username: req.body.username}).then((user) => {
            if (user !== null) {
                // Use bcrypt to compare the plaintext password and encrypted password
                bcrypt.compare(req.body.password, user.password, (error, result) => {
                    if (result) {
                        tokens = getAccessToken(user);
                        user.refreshTokens.push(tokens.refreshToken);
                        user.save();
                        // Send the JSON Web Token back to the user
                        res.status(200).json({ success: true, accessToken: tokens.accessToken, user: user._id, refreshToken: tokens.refreshToken });
                    }
                    // If !resolve then return invalid password
                    if (!result) {
                        res.status(401).json({
                            error: {
                                name: 'InvalidDataEntry',
                                message: 'Invalid Password'
                            }
                        });
                    }
                    if (error) {
                        res.status(500).json( { message: `Big error: ${error}` } )
                    }
                })
            } else {
                // If username not found, return invalid username
                res.status(401).json( { error: {
                    name: 'InvalidDataEntry',
                    message: 'Invalid Username'
                } } )
            }
        })
    } else {
        // If no data entered return this error
        res.status(400).json({
            error: {
                name: 'InvalidDataEntry',
                message: 'Please enter a username and password'
            }
        });
    }
});

// Refresh Token
router.post('/api/token/:id', (req, res) => {
    const refreshToken = req.body.token
    
    User.findById(req.params.id).then(user => {
        console.log(user);
        if (refreshToken == null) return res.status(401).json({ error: 'No refresh token found...' })
        if (!user.refreshTokens.includes(refreshToken)) return res.status(403).json({ error: 'Invalid Refresh Token' })
        jwt.verify(refreshToken, jwtOptions.refreshSecret, (err, user) => {
            if (err) return res.status(403).json({ error: 'Failed to verify refresh token' })
            const tokens = getAccessToken(user);
            res.json({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken })
        });
    });
});

router.patch('/api/logout/:id', (req,res) => {
    User.findByIdAndUpdate(req.params.id).then(user => {
        console.log(user);
        user.refreshTokens = user.refreshTokens.filter(token => token !== req.body.token)
        console.log(user);
        user.save();
        res.status(204).json({ message: 'Refresh Token Deleted' })
    });
});

//Test case
router.get('/api/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.status(200).json({
      message: 'Hey, you can only see this msg with the JSON Web Token.',
      user: req.user
    });
  });

module.exports = router;