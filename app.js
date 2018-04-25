'use strict'

const express = require('express');
const config = require('./config/index');
const asyncClient = require('./utils/poly_mqtt');

let app = express();

app.post('/', (req, res) => {
    req.rawBody = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => { 
        req.rawBody += chunk;
    });
    req.on('end', () => {});
}).listen(config.app_config.port);

console.log('Plugin Services Listen On ' + config.app_config.port);

