'use strict';

var request = require('request');
var crypto = require('crypto');
var util = require('util');

const PRIVATE_KEY = "GjcfbhCIJ2owQP1Kxn64DqSk5X4YRZ7u";
// http://test.poly.ourjujia.com/api/v1/
const API_URL = "http://test.poly.ourjujia.com/api/v1/";

/**
 * 计算签名
 * @param json_data 
 */
var getSign = function(json_data){
  let vercy = JSON.stringify(json_data) + PRIVATE_KEY;
  let md5sum = crypto.createHash('md5');
  md5sum.update(vercy);
  let sign_data = md5sum.digest('hex');
  return sign_data;
}

/*
 * 向服务器提交人脸记录
 * Promise
 */
exports.genPostFaceLogger = function(data) {
  return new Promise(function(resolve, reject){
    var req_data = data;
    var vercy = JSON.stringify(req_data) + PRIVATE_KEY;
    var md5sum = crypto.createHash('md5');
    md5sum.update(vercy);
    var sign_data = md5sum.digest('hex');
    var options = {
        url: API_URL + "sync/face_logger",
        method: 'POST',
        json: true,
        body: {
          sign: sign_data,
          data: JSON.stringify(req_data)
        }
    };
    request(options, function (err, res, body){
      if (!err && res.statusCode == 200 && body.error_code == 0){
        resolve(body.data);
      } else {
        reject({'Error: ': err});
      }
    });
  });
};

/*
 * 向服务器提交刷卡记录
 * Promise
 */
exports.genPostAccessLogger = function(data) {
  return new Promise(function(resolve, reject){
    var req_data = data;
    var vercy = JSON.stringify(req_data) + PRIVATE_KEY;
    var md5sum = crypto.createHash('md5');
    md5sum.update(vercy);
    var sign_data = md5sum.digest('hex');
    var options = {
        url: API_URL + "sync/access_logger",
        method: 'POST',
        json: true,
        body: {
          sign: sign_data,
          data: JSON.stringify(req_data)
        }
    };
    request(options, function (err, res, body){
      if (!err && res.statusCode == 200 && body.error_code == 0){
        resolve(body.data);
      } else {
        reject({'Error': err});
      }
    });
  });
};

/*
 * 向服务器提交用户列表
 * Promise
 */
exports.genPostUsers = function(data) {
  return new Promise(function(resolve, reject){
    var req_data = data;
    var vercy = JSON.stringify(req_data) + PRIVATE_KEY;
    var md5sum = crypto.createHash('md5');
    md5sum.update(vercy);
    var sign_data = md5sum.digest('hex');
    var options = {
        url: API_URL + "sync/face_user",
        method: 'POST',
        json: true,
        body: {
          sign: sign_data,
          data: JSON.stringify(req_data)
        }
    };
    request(options, function (err, res, body){
      if (!err && res.statusCode == 200 && body.error_code == 0){
        resolve(body.data);
      } else {
        reject({'code': err});
      }
    });
  });
};

/**
 * 获取家庭列表接口
 * user_id # 用户ID
 * ticket # session登录验证
 * family_id #家庭ID
 */
exports.generateQueryFamilies = function(params) {
  return new Promise(function(resolve, reject){
    var req_data = {'user_id': params.id, 'ticket': params.ticket};
    var private_key = "GjcfbhCIJ2owQP1Kxn64DqSk5X4YRZ7u";
    var vercy = JSON.stringify(req_data) + private_key;
    var md5sum = crypto.createHash('md5');
    md5sum.update(vercy);
    var sign_data = md5sum.digest('hex');
    var options = {
        url: 'http://test.poly.ourjujia.com/api/v1/family_user_queryfamilies',
        method: 'POST',
        json: true,
        body: {
          sign: sign_data,
          data: JSON.stringify(req_data)
        }
    };
    request(options, function (err, res, body) {
      if (!err && res.statusCode == 200){
          var families = []
          if(body.data.families){
              body.data.families.forEach(function(item, index) {
                  // console.log(item);
                  if (item.device_id != undefined){
                      families.push({"device_id": item.device_id,"family_name": item.family_name,"family_id": item.id})
                  }
              });
          }
          var res_data = {"id": params.id, "mobile": params.mobile, "family": families}
          resolve(res_data)
      } else {
        reject('error')
      };
    });
  });
};

