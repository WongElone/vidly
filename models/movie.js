const Joi = require('joi');
const mongoose = require('mongoose');
const { genreSchema } = require('./genre');

const Movie = mongoose.model('Movie', mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 999
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 999
    },
    genre: {
        type: genreSchema,
        required: true
    }
}));

function validateMovie(movie) {
    const schema = {
        title: Joi.string().min(5).max(50).required(),
        numberInStock: Joi.number().min(0).max(999).required(),
        dailyRentalRate: Joi.number().min(0).max(999).required(),
        genre: Joi.object().keys({
            name: Joi.string().min(3).required()
        }).required()
    };

    return Joi.validate(movie, schema);
}

function validateMoviePut(changes) {
    const schema = {
        title: Joi.string().min(5).max(50),
        numberInStock: Joi.number().min(0).max(999),
        dailyRentalRate: Joi.number().min(0).max(999),
        genre: Joi.object().keys({
            name: Joi.string().min(3).required()
        })
    }

    return Joi.validate(changes, schema);
}

module.exports.Movie = Movie;
module.exports.validateMovie = validateMovie;
module.exports.validateMoviePut = validateMoviePut;