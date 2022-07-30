const autho = require('../middleware/autho');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();
const { Movie, validateMovie, validateMoviePut } = require('../models/movie');
const { Genre } = require('../models/genre');

router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('title');

    res.send(movies);
});

router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id);

    if (!movie) return res.status(404).send('The movie with the given ID was not found.');

    res.send(movie);
});

router.post('/', autho, async (req, res) => {
    const { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('The genre with the given genre ID was not found.');

    let movie = new Movie({
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        genre: {
            _id: genre._id,
            name: genre.name
        }
    });

    await movie.save();

    res.send(movie);
});

router.delete('/:id', [autho, admin], async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);

    if (!movie) return res.status(404).send('The movie with the given ID was not found.');

    res.send(movie);
});

router.put('/:id', autho, async (req, res) => {
    const { error } = validateMoviePut(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send('The movie with the given ID was not found.');

    for (let key in req.body) {
        if (key === 'genreId') {
            const genre = Genre.findById(req.body.genreId);
            if (error) return res.status(400).send('Invalid genre.');

            movie.genre = {
                _id: genre._id,
                name: genre.name
            }
        }
        else movie[key] = req.body[key];
    }
    
    await movie.save();

    res.send(movie);
});

module.exports = router;