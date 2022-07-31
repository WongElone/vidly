const winston = require('winston');
require('winston-mongodb');
const config = require('config');
const error = require('./middleware/error');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const authen = require('./routes/authen');
const express = require('express');
const app = express();

process.on('uncaughtException', async (ex) => {
    console.log('We Got An Uncaught Exception.');
    await new Promise((resolve, reject) => {
        winston.error(ex.message, ex);
    });
    process.exit(1);
});

process.on('unhandledRejection', async (ex) => {
    throw new Error(ex);
});

winston.add(winston.transports.File, { filename: 'logfile.log' });

if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1); // anthing except 0 is failure
}

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(() => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/authen', authen);
app.use(error);

app.get('/', (req, res) => res.send('Hello World!'));

const port = process.env.port || 3000;
app.listen(port, () => console.log(`Listening to port ${port}`));