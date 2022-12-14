const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/routes')(app);
require('./startup/db')();
require('./startup/logging')();
require('./startup/config')();
require('./startup/validation')();
require('./startup/prod')(app);

app.get('/', (req, res) => res.send('Hello World!'));

const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Listening to port ${port}`));