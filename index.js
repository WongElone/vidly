const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const genres = require('./genres');
const customers = require('./customers');
const movies = require('./movies');
const rentals = require('./rentals');
const express = require('express');
const app = express();

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(() => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);

app.get('/', (req, res) => res.send('Hello World!'));

const port = process.env.port || 3000;
app.listen(port, () => console.log(`Listening to port ${port}`));