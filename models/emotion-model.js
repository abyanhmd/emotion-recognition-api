const mongoose = require('mongoose');

const emotionSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    emotion: {
        type: String,
        default: '',
    },
    dateTaken: {
        type: Date,
        default: Date.now,
    },
    duration: {
        type: String,
        default: '',
    },
    suggestion: {
        type: String,
        default: ''
    },
    fileName: {
        type: String,
        default: ''
    },
    audioFile: {
        type: String, 
        required: true,
    }
});

emotionSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

emotionSchema.set('toJSON', {
    virtuals: true,
});

exports.Emotion = mongoose.model('emotion-database', emotionSchema);
exports.userSchema = emotionSchema;
