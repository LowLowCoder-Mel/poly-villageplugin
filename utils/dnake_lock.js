'use strict';

const request = require('request');
const crypto = require('crypto');
const util = require('util');
const config = require('../config/index');

/**
 * 指定单元门/围墙机开锁
 * {
 *    "domain": "villageplugin",
 *    "service": "unlock",
 *    "data": {"type": "1", "building": "6", "unit": "01", "index": "01", 'user_id': id}
 * }
 */
exports.unlockDoor = (data) => {
    return new Promise((resolve, reject) => {
      let id = util.format('%s%s99%s', data.building, data.unit, data.index);
      console.log(id);
      let options = {
          url: `http://${config.dnake_server.ip}:8088/http2sip.cgi?id=" + id + "&event_url=/talk/unlock`,
          method: 'GET',
          json: true,
          timeout: 8000
      };
      request(options, (err, res, body) => {
        if (!err && res.statusCode == 200){
          console.log("Unlock OK");
          resolve({'code': 0, 'msg': 'ok'})
        } else {
          // reject({'code': 1, 'msg': 'error'})
        }
      });
    });
  };
  