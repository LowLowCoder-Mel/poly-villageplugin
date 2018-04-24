'use strict'

const express = require('express');
const config = require('./config/index');
const asyncClient = require('./utils/poly_mqtt');

var app = express();

app.post('/', (req, res) => {
    req.rawBody = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk) { 
        req.rawBody += chunk;
    });
    req.on('end', function() {});
}).listen(config.app_config.port);

console.log('DuerOS Services Listen On ' + config.app_config.port);

// faceModel.getFaceLoggerById("1", "2")
//     .then(function(results){
//         results.forEach(element => {
//             console.log(element.id);
//             console.log(element.user);
//             console.log(element.dev);
//             console.log(element.uid);
//             console.log(element.similarity);
//             console.log(element.ts);
//         });
//     });

//==============
// const faceModel = require("./models/record_face");
// faceModel.getFaceLoggerByTime("2018-4-11")
//     .then(function(results){
//         results.forEach(element => {
//             element.village_id = config.village_config.village;
//         });
//         console.log(results);
//         return results;
//     });

//================
// var faceModel = require("./utils/dnake_lock");
// faceModel.unlockDoor({"type": "1", "building": "6", "unit": "01", "index": "01"});

