'use strict';

const request = require('request');
const crypto = require('crypto');
const util = require('util');
const utf8 = require('utf8');

const PRIVATE_KEY = "GjcfbhCIJ2owQP1Kxn64DqSk5X4YRZ7u";
const API_URL = require('../config/index').cloud_server.base_url
const API_URL_FACE_LOGGER = API_URL + "sync/face_logger";
const API_URL_FACE_USERS = API_URL + "sync/face_user";
const API_URL_ACCESS_LOGGER = API_URL + "sync/access_logger";


/*
 * 向服务器提交人脸记录
 * Promise
 */
exports.genPostFaceLogger = (data) => {
  return new Promise((resolve, reject) => {
    let utf8_data = utf8.encode(data);
    let sign_data = getSign(data);
    let options = {
        url: API_URL_FACE_LOGGER,
        method: 'POST',
        json: true,
        body: {
          sign: sign_data,
          data: utf8_data
        }
    };
    request(options, (err, res, body) => {
      if (!err && res.statusCode == 200 && body.error_code == 0){
        resolve(body.data);
      } else {
        reject({'User_Error: ': err});
      }
    });
  });
};

/*
 * 向服务器提交刷卡记录
 * Promise
 */
exports.genPostAccessLogger = (data) => {
  return new Promise((resolve, reject) => {
    let utf8_data = utf8.encode(data);
    let sign_data = getSign(data);
    let options = {
        url: API_URL_ACCESS_LOGGER,
        method: 'POST',
        json: true,
        body: {
          sign: sign_data,
          data: utf8_data
        }
    };
    request(options, (err, res, body) => {
      if (!err && res.statusCode == 200 && body.error_code == 0){
        resolve(body.data);
      } else {
        reject({'Access_Logger_Error': err});
      }
    });
  });
};

/*
 * 向服务器提交用户列表
 * Promise
 */
exports.genPostUsers = (data) => {
  return new Promise((resolve, reject) => {
    let utf8_data = utf8.encode(data);
    let sign_data = getSign(data);
    let options = {
        url: API_URL_FACE_USERS,
        method: 'POST',
        json: true,
        body: {
          sign: sign_data,
          data: utf8_data
        }
    };
    request(options, (err, res, body) => {
      if (!err && res.statusCode == 200 && body.error_code == 0){
        resolve(body.data);
      } else {
        reject({'Face_User_Error': err});
      }
    });
  });
};

/**
 * 计算签名
 * @param json_data 
 */
const getSign = (json_data) => {
  let utf8_data = utf8.encode(json_data);
  let vercy = utf8_data + PRIVATE_KEY;
  let md5sum = crypto.createHash('md5');
  md5sum.update(vercy);
  let sign_data = md5sum.digest('hex');
  return sign_data;
}

