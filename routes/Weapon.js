const { response } = require('express');
const express = require('express');

const Weapon = require('../models/Weapon');

const router = express.Router();

// Action: Index
// Method: GET
// URI: /weapons
// Description: Get All Weapons

router.get('/api/weapons', (req, res) => {
    Weapon.find()
    .then((weapons) => {
        res.status(200).json({ weapons: weapons});
    })
    .catch((error) => {
        res.status(500).json({ error: error });
    })
})

// Action: Index
// Method: GET
// URI: /weapons/:id
// Description: Get a specific weapon

router.get('/api/weapons/:id', (req, res) => {
    Weapon.findById(req.params.id)
    .then((weapon) => {
        res.status(200).json({ weapon: weapon });
    })
    .catch((error) => {
        res.status(500).json({ error: error });
    })
})

module.exports = router;