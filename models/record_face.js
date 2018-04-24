'use strict';

var query = require('./base.js');

/*
 * 通过id间隔获取人脸记录
 */
exports.getFaceLoggerById = function (startid, endid){
    let sql = "select * from face_logger where id between " + parseInt(startid) + " and " + parseInt(endid);
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
 * 通过时间间隔获取人脸记录
 */
exports.getFaceLoggerByTime = function (date){
    // let date = '2018-4-13'
    let sql = "select * from face_logger where ts between '" + date + " 0:00:00' and '" + date + " 23:59:59'";
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
 * 获取人脸记录行数
 */
exports.getFaceLoggerRows = function (){
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

