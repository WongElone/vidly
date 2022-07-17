const Joi = require('joi');
const genres = require('./genres');
const express = require('express');
const app = express();

app.use(express.json());
app.use('/api/genres', genres);

app.get('/', (req, res) => res.send('Hello World!'));



const port = process.env.port || 3000;
app.listen(port, () => console.log(`Listening to port ${port}`));