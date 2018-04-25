'use strict';

const request = require('request');
const crypto = require('crypto');
const util = require('util');

/**
 * 指定单元门/围墙机开锁
 * {
 *    "domain": "villageplugin",
 *    "service": "unlock",
 *    "data": {"type": "1", "building": "6", "unit": "01", "index": "01"}
 * }
 */
exports.unlockDoor = (data) => {
    let id = util.format('%s%s99%s', data.building, data.unit, data.index);
    console.log(id);
    var options = {
        url: "http://127.0.0.1:8088/http2sip.cgi?id=" + id + "&event_url=/talk/unlock",
        method: 'GET',
        json: true,
        timeout: 10000
    };
    request(options, (err, res, body) => {
      if (!err && res.statusCode == 200){
        console.log("Unlock OK");
      }  
    });
  };
  