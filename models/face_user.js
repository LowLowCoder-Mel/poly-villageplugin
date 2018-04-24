'use strict';

var query = require('./base.js');

/*
 * 通过id间隔获取人脸信息记录
 */
exports.getFaceUsersById = function (startid, endid){
    let sql = "select * from face_user where id between " + parseInt(startid) + " and " + parseInt(endid);
    return new Promise(function (resolve, reject){
        query(sql, [1], function (err, results, fields){ 
            if (err){
                reject(err);
            }
            // console.log(results);
            resolve(results);
        });
    });
};

/*
 * 通过时间间隔获取人脸用户记录
 */
exports.getFaceUsers = function (){
    let sql = "select * from face_user";
    return new Promise(function (resolve, reject){
        query(sql, [1], function (err, results, fields){ 
            if (err){
                reject(err);
            }
            // console.log(results);
            resolve(results);
        });
    });
};

/*
 * 获取人脸信息记录行数
 */
exports.getFaceUsersRows = function (){
    let sql = "select count(id) from face_logger";
    return new Promise(function (resolve, reject){
        query(sql, [1], function (err, results, fields){ 
            if (err){
                reject(err);
            }
            // console.log(results);
            resolve(results);
        });
    });
};

