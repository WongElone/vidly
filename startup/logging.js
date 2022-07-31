const winston = require('winston');

winston.add(winston.transports.File, { filename: 'logfile.log' });

module.exports = function() {
    process.on('uncaughtException', log);
    
    process.on('unhandledRejection', log);
}

function log(ex) {
    try {
        winston.error(ex.message, ex);
    }
    catch (ex) {
        console.log("Error Logging Failed");
    }
    setTimeout(() => {
        process.exit(1);
    }, "1000");
}