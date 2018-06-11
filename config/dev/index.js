'use strict'

/**
 * 应用程序 配置参数
 */

exports.village_config = {
  village: 5
}

exports.app_config = {
  'port': 8625
}

exports.mqtt_config = {
  'url': 'mqtt://60.205.151.71',
  'port': 3883,
  'clinet_id': '',
  'username': 'polyhome',
  'password': '123'
}

exports.cloud_server = {
  'base_url': 'http://test.poly.ourjujia.com/api/'
}

exports.dnake_server = {
  'ip': '127.0.0.1'
}

exports.database_config = {
  'host': '127.0.0.1',
  'user': 'root',
  'password': '123456',
  'database': 'dnake',
  'port': 4406
}
