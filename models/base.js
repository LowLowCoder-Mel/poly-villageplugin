'use strict';
/**
  var config = require('../config/index.js');
  var mongoskin = require('mongoskin');
  var db = mongoskin.db(config.mongo_url, {native_parser: true});
  exports.getCollection = function (collectionName) {
    return db.collection(collectionName);
  };
  exports.ObjectID = mongoskin.ObjectID;
*/

// var MongoClient = require('mongodb').MongoClient;
// var MONGO_URL = 'mongodb://user:polyhome@60.205.151.71:57017/polydb';
// var mogo_db;

// MongoClient.connect(MONGO_URL, function(err, db){
//     if (err){
//       console.log('Database connect Error');
//       return
//     }
//     console.log('Database connect Success');
//     mogo_db = db;
// });

// exports.getDB = function(){
//     return mogo_db
// };

/**
 * Mysql
 */
var mysql = require('mysql');

var pool = null;
if (pool == null){
  pool = mysql.createPool({
    host: '192.168.3.2',
    user: 'root',
    password: '123456',
    database: 'dnake',
    port: 4406
  });
}

var query = function(sql, options, callback){  
  pool.getConnection(function(err,conn){  
      if(err){  
          callback(err,null,null);  
      }else{  
          conn.query(sql,options,function(err,results,fields){  
              //释放连接  
              conn.release();  
              //事件驱动回调  
              callback(err,results,fields);  
          });  
      }  
  });  
};

module.exports = query;




