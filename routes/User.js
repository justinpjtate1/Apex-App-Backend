// Require necessary NPM Packages
const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
// Require Mongoose Model for User
const User = require('./../models/User');

// Instantiate a Router (mini app that only handles routes)
const router = express.Router();

/*
Action:        SHOW
Method:        GET
URI:        /api/user/:userID
Description:    Get user
*/
router.get('/api/user/:userID', passport.authenticate('jwt', { session: false }), (req, res) => {
    User.findById(req.params.userID)
    .populate('favoriteWeapons')
    .then((user) => {
        if (user) {
            res.status(200).json({ user: {
                username: user.username,
                favoriteWeapons: user.favoriteWeapons,
                _id: user._id,
                profileImg: user.profileImg
            } });
        } else {
            // If cannot find a document with a matching ID
            res.status(404).json({
                error: {
                    name: 'UserNotFound',
                    message: `User not found`
                }
            });
        }
    })
    .catch((error) => {
        res.status(500).json( { error: error } );
    });
});

/*
Action:        DESTROY
Method:        DELETE
URI:        /api/user/:userID
Description:    Delete user via user id
*/

router.delete('/api/user/:userID', passport.authenticate('jwt', { session: false }), (req,res) => {
    User.findById(req.params.userID)
    .then((user) => {
        if (user) {
            // Pass the result of Mongoose's `.remove` method to the next `.then`
            return user.remove();
        } else {
            // If we coudn't find a user with a matching ID
            res.status(404).json({
                error: {
                    name: 'UserNotFound',
                    message: 'User associated with this ID not found'
                }
            });
        }
    })
    .then(() => {
        // If the deletion succeeded, return 204 and no JSON
        res.status(204).end();
    })
    .catch((error) => {
        // Catch any error that might occur
        res.status(500).json( { error: error } );
    });
});

/*
Action:        CREATE
Method:        POST
URI:        /api/user
Description:    Create A New User
*/
// ADD A CHECK THAT CHECKS IF THE USERNAME OF THE NEW USER IS ALREADY USED BY ANOTHER USER

// Rounds of salting
const saltRounds = 10;
router.post('/api/user', (req,res) => {
    if (req.body.user.username.length >=8 && req.body.user.username.length <=20 && req.body.user.password.length >= 8 && req.body.user.password.length <=20) {
        const { username, password } =req.body.user;
        bcrypt.hash(password, saltRounds).then((hash) => {
            User.create({
                username: username,
                password: hash
            })
        })
        // On successful create action respond with 201
        // and content of new User
        .then(() => {
            // Check that the username and password are all of correct length
            res.status(201).end();
        })
        // Catch any errors that might occur
        .catch((error) => {
            res.status(500).json({ error: error });
        });
    }
    else {
        res.status(406).json({ error: {
            name: 'UsernameAndPasswordLengthsWrong',
            message: 'Username and Password must be between 8-20 characters (inclusive)'
        }});
    }

})

/*
Action:        UPDATE
Method:        PUT/PATCH
URI:        /api/user/:userID
Description:    Update user by user ID
*/
router.patch('/api/user/:userID', passport.authenticate('jwt', { session: false }), (req, res) => {
    User.findById(req.params.userID)
      .then((user) => {
        if (user) {
          // Pass the result of Mongoose's `.update` method to the next `.then`
          return user.update(req.body.user);
        } else {
          // If we coudn't find a user with the matching ID
          res.status(404).json({
            error: {
              name: 'DocumentNotFoundError',
              message: 'The provided ID doesn\'t match any documents'
            }
          });
        }
      })
      .then(() => {
        // If the update succeded, return 204 and no JSON
        res.status(204).end();
      })
      // Catch any error that might occur
      .catch((error) => {
        res.status(500).json({ error: error });
      });
  });

// Export the router so we can use it in the 'server.js' file
module.exports = router;