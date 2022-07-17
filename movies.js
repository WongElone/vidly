const express = require('express');
const router = express.Router();
const { Movie, validateMovie, validateMoviePut } = require('./models/movie');

router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('title');

    res.send(movies);
});

router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id);

    if (!movie) return res.status(404).send('The movie with the given ID was not found.');

    res.send(movie);
});

router.post('/', async (req, res) => {
    const { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let movie = new Movie({
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        genre: req.body.genre        
    });

    movie = await movie.save();

    res.send(movie);
});

router.delete('/:id', async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);

    if (!movie) return res.status(404).send('The movie with the given ID was not found.');

    res.send(movie);
});

router.put('/:id', async (req, res) => {
    const { error } = validateMoviePut(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send('The movie with the given ID was not found.');

    for (let key in req.body)
        movie[key] = req.body[key];
    
    movie = await movie.save();

    res.send(movie);
});

module.exports = router;