const express = require('express');
const app = express();
const path = require('path');
const logger = require(path.join(__dirname, 'logger.js'));
const bodyParser = require('body-parser');
const randomstring = require('randomstring');
const fs = require('fs');

module.exports = function (options) {

    app.enable('strict routing');
    app.use(bodyParser.json());
    // app.param('id', handleUserId);
    // app.get('/:id', handleMissingSlashAfterCandidateId);
    // app.get('/:id/', handleSurveyMainPage);
    // app.get('/:id/surveys', handleSurveysRequest);
    // app.post('/:id/options', handleSavingOptions);
    app.use('/:id/', express.static('dist'));

    return app;

}
