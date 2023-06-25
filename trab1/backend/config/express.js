'use strict'

const express = require('express');
const cors = require('cors')
const config = require('config');
const consign = require('consign');

module.exports = () => {
    const app = express();
    app.use(express.json());

    // Sets enviroment variables.
    app.set('port', process.env.PORT || config.get('server.port'));

    // Middlewares.
    app.use(cors())

    // Connect endpoints.
    consign({ cwd: 'api' })
        .then('controllers')
        .then('routes')
        .into(app);

    return app;
};