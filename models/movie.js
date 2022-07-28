const Joi = require('joi');
const mongoose = require('mongoose');
const { genreSchema } = require('./genre');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    genre: {
        type: genreSchema,
        required: true
    }
});

const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(movie) {
    const schema = {
        title: Joi.string().min(5).max(50).required(),
        numberInStock: Joi.number().min(0).max(999).required(),
        dailyRentalRate: Joi.number().min(0).max(999).required(),
        // genre: Joi.object().keys({
        //     name: Joi.string().min(3).required()
        // }).required()
        genreId: Joi.objectId().required()
    };

    return Joi.validate(movie, schema);
}

function validateMoviePut(changes) {
    const schema = {
        title: Joi.string().min(5).max(50),
        numberInStock: Joi.number().min(0).max(999),
        dailyRentalRate: Joi.number().min(0).max(999),
        genreId: Joi.objectId()
    };

    return Joi.validate(changes, schema);
}

module.exports.Movie = Movie;
module.exports.movieSchema = movieSchema;
module.exports.validateMovie = validateMovie;
module.exports.validateMoviePut = validateMoviePut;