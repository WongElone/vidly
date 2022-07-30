const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 55
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    }
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('User', userSchema);

function validateUserPost(user) {
    const schema = {
        name: Joi.string().min(5).max(55).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required() // max only 255, after hash it will become longer
    };

    return Joi.validate(user, schema);
}

function validateUserPut(changes) {
    const schema = {
        name: Joi.string().min(5).max(55),
        email: Joi.string().min(5).max(255).email(),
        password: Joi.string().min(5).max(255) // max only 255, after hash it will become longer
    };

    return Joi.validate(changes, schema);
}

module.exports.User = User;
module.exports.validateUserPost = validateUserPost;
module.exports.validateUserPut = validateUserPut;