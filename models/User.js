// Require NPM mongoose
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // Potentially set up min and max characters
    // add default src for profileImg
    username: { type: String, required: true },
    password: { type: String, required: true },
    profileImg: {type: String, required: false},
    favoriteWeapons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: `Weapon`
    }]
});
// Compile model on schema
const User = mongoose.model('User', userSchema);

//Export
module.exports = User;