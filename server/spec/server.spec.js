const server = require('../server.js');
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

describe('Academy server', function() {
    it('accepts empty setup', function() {
        server({}, function() { });
    });
    it('starts on port 9342', function(done) {
        let serverSetup = {
            httpPort: 9343,
        };
        startServerAndServeString(serverSetup, 'okay');
        readUrl({
            hostname: 'localhost',
            port: 9343,
            path: '/'
        }, (rawData) => {
            expect(rawData).toBe('okay');
            done();
        }, http)
    });
});

function readUrl(options, ondataEnd, client) {
    client.get(options, (res) => {
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => { ondataEnd(rawData); });
    });
}

function startServerAndServeString(setup, responseString) {
    server(setup, function(req, res) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(responseString);
    });
}
