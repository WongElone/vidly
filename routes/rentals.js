const express = require('express');
const router = express.Router();
const { Rental, validateRentalPost, validateRentalPut } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');


router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('movie.title'); //maybe wrong
    
    res.send(rentals);
});

router.get('/:id', async (req, res) => {
    const rental = await Rental.findById(req.params.id);
    
    if (!rental) return res.status(404).send('Rental with thegiven ID was not found.');
    
    res.send(rental);
});

router.post('/', async (req, res) => {
    const { error } = validateRentalPost(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid customer.');

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid movie.');

    if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone,
            isGold: customer.isGold
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },
        rentalFee: req.body.rentalFee
    });
    // transaction should be added here
    await rental.save();

    movie.numberInStock--;
    movie.save();
    
    res.send(rental);
});

router.put('/:id', async (req, res) => {
    const { error } = validateRentalPut(req.body);
    
    if (error) return res.status(400).send(error.details[0].message);
    
    let rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).send('Rental with the given ID was not found.');
    
    for (let key in req.body) {
        if (key === "movieId") {
            const movie = await Movie.findById(req.body.movieId);
            if (!movie) return res.status(400).send('Invalid movie.');

            rental.movie = {
                _id: movie._id,
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate
            }
        }
        else if (key === "customerId") {
            const customer = await Customer.findById(req.body.customerId);
            if (!customer) return res.status(400).send('Invalid customer.');

            rental.customer = {
                _id: customer._id,
                name: customer.name,
                phone: customer.phone,
                isGold: customer.isGold
            }        
        }
        else rental[key] = req.body[key];
    }
        
    await rental.save();
    
    res.send(rental);
});

router.delete('/:id', async (req, res) => {    
    const rental = await Rental.findByIdAndRemove(req.params.id);

    if (!rental) return res.status(404).send('Rental with the given ID was not found.');
    
    res.send(rental);
});

module.exports = router;
