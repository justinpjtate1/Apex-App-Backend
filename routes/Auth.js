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

// Instantiate a Router (mini app that only handles routes)
const router = express.Router();

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
                        // Select the information we want to send to the user.
                        const payload = {
                            id: user._id
                        };
                        // Build a JSON Web Token using the payload - This will last 300 seconds
                        const token = jwt.sign(payload, jwtOptions.secretOrKey, { expiresIn: 300 });

                        // Send the JSON Web Token back to the user
                        res.status(200).json({ success: true, token: token });
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

//Test case
router.get('/api/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.status(200).json({
      message: 'Hey, you can only see this msg with the JSON Web Token.',
      user: req.user
    });
  });

module.exports = router;