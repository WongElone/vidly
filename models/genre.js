const Joi = require('joi');
const mongoose = require('mongoose');

const Genre = mongoose.model('Genre', mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    }
}));

function validateGenre(genre) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(genre, schema);
}

modules.export.Genre = Genre;
modules.export.validateGenre = validateGenre;