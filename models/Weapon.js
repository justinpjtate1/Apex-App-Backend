// Require NPM mongoose
const mongoose = require('mongoose');

const weaponSchema = new mongoose.Schema({
    weaponName: { type: String, required: true },
    weaponImg: { type: String },
    weaponType: { type: String, required: true },
    stats: {
        ammoType: { type: String, required: true },
        // damage per second
        dps: { type: Number, required: true },
        // rounds per minute
        rpm: { type: Number, required: true }
    }
});

// Compile model on schema
const Weapon = mongoose.model('Weapon', weaponSchema);

//Export
module.exports = Weapon;