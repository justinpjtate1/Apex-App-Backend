// Require NPM mongoose
const mongoose = require('mongoose');

const generalChatSchema = new mongoose.Schema({
    // Potentially set up min and max characters
    // add default src for profileImg
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: `User`,
        required: true
    },
    comment: { type: String, required: true }
});
// Compile model on schema
const GeneralChat = mongoose.model('GeneralChat', generalChatSchema);

//Export
module.exports = GeneralChat;