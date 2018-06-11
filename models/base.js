'use strict'

/**
 * Mysql
 */
const mysql = require('mysql')
const db_config = require('../config/index').database_config

var pool = null
if (pool == null) {
  pool = mysql.createPool({
    host: db_config.host,
    user: db_config.user,
    password: db_config.password,
    database: db_config.database,
    port: db_config.port
  })
}

const query = (sql, options, callback) => {
  pool.getConnection((err, conn) => {
    if (err) {
      callback(err, null, null)
    } else {
      conn.query(sql, options, (err, results, fields) => {
        // 释放连接
        conn.release()
        // 事件驱动回调
        callback(err, results, fields)
      })
    }
  })
}

module.exports = query
