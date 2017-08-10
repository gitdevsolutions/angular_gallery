const http = require('http');
const path = require('path');
const logger = require(path.join(__dirname, 'logger.js'));
const express = require('express');

module.exports = (setup, app) => {
    setDefaults(setup);
    startInsecureServer(setup, app);
}

function setDefaults(setup) {
    setup.httpPort = setup.httpPort | 0;
}

function startInsecureServer(setup, app) {
    var insecureServer = http.createServer(app).listen(setup.httpPort, function () {
        logger.log('info', 'Insecure Server listening on port ' + insecureServer.address().port);
    });
}
