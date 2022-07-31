const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/routes')(app);
require('./startup/db')();
require('./startup/logging')();
require('./startup/config')();
require('./startup/validation')();

app.get('/', (req, res) => res.send('Hello World!'));

const port = process.env.port || 3000;
app.listen(port, () => winston.info(`Listening to port ${port}`));