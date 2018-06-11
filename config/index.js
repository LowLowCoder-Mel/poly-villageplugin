'use strict'

const path = require('path')

let env = process.env.NODE_ENV || 'pro'

let config = {}

if (env === 'pro') {
  config = require(path.join(__dirname, '/pro/', 'index'))
} else {
  config = require(path.join(__dirname, '/dev/', 'index'))
}

module.exports = config
