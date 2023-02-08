// Require neccessary NPM Package
const express = require('express');

// Require Mongoose Model for Article
const GeneralChat = require('../models/GeneralChat')

// Instantiate a Router
const router = express.Router()

/**
 * Action:          INDEX
 * Method:          GET
 * URI:             /api/generalchat
 * Description:     Get all comments
 */
router.get('/api/generalchat', (req, res) => {
    GeneralChat.find()
    // Return all comments as an Array
    .then((comment) => {
      res.status(200).json({ comment: comment });
    })
    // Catch any errors that might occure
    .catch((error) => {
      res.status(500).json({ error: error });
    });
  });
  


/**
 * Action:          INDEX
 * Method:          GET
 * URI:             /api/generalchat
 * Description:     Get all comments
 */
router.get('/api/generalchat', (req, res) => {
    GeneralChat.find()
    .then((comment) => {
      res.status(200).json({ comment: comment });
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
  });


/**
 * Action:          SHOW
 * Method:          GET
 * URI:             /api/generalchat/:id
 * Description:     Get a comment by its ID
 */
router.get('/api/generalchat/:id', (req, res) => {
    GeneralChat.findById(req.params.id)
    .then((comment) => {
        if(comment){
            res.status(200).json({ comment: comment });
        } else {
            res.status(404).json({
                error: {
                    name: 'BadRequest',
                    message: `The provided ID doesn't match any documents`
                }
            })
        }
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
  });


/**
 * Action:          DESTROY
 * Method:          DELETE
 * URI:             /api/generalchat/:id
 * Description:     Delete a comment by its ID
 */
router.delete('/api//generalchat/:id', (req, res) => {
    GeneralChat.findById(req.params.id)
    .then((comment) => {
        if(comment){
            return comment.remove()
        } else {
            res.status(400).json({
                error: {
                    name: 'BadRequest',
                    message: `The provided ID doesn't match any documents`
                }
            })
        }
    })
    .then(() => {
        // if successed
        res.status(204).end()
    })
    .catch((error) => {
        res.status(500).json({
            error: {
                name: 'InternalServerError',
                message: `Something went wrong`
            }
        })
    })
})



/**
 * Action:          UPDATE
 * Method:          PATCH/PUT
 * URI:             /api/generalchat/:id
 * Description:     Update a comment by its ID
 */
router.put('/api/generalchat/:id', (req, res) => {
    GeneralChat.findById(req.params.id)
    .then((comment) => {
        if(comment){
            // Pass the result of Mongoose's .update method to the next .then
            return comment.update(req.body.comment)
        } else {
            res.status(404).json({
                error: {
                    name: 'BadRequest',
                    message: `The provided ID doesn't match any documents`
                }
            })
        }
    })
    .then(() => {
        // if update succeded, return 204 and no JSON
        res.status(204).end()
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
  });



/**
 * Action:          CREATE
 * Method:          POST
 * URI:             /api/generalchat
 * Description:     Create a comment
 */
router.get('/api/generalchat/:id', (req, res) => {
    GeneralChat.create(req.params.comment)
    .then((comment) => {
        // if successful
        res.status(201).json({comment: newComment})
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
  });


// Export the Router so we can use it in the `server.js` file
module.exports = router; 