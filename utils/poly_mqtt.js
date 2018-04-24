'use strict'

/**
 * Polyhome Mqtt通信
 */
const AsyncClient = require("async-mqtt");
const config = require('../config/index');
const httprequest = require('./api');
const dnakelock = require('./dnake_lock')
const faceModel = require("../models/record_face");
const accessModel = require("../models/record_access");
const usersModel = require("../models/face_user");

var asyncClient = AsyncClient.connect(config.mqtt_config.url, {
    port: config.mqtt_config.port,
    username: config.mqtt_config.username,
    password: config.mqtt_config.password,
    clientId: "village_plugin_" + config.village_config.village
});

asyncClient.on('connect', function () {
    console.log('mqtt success connect');
    
    asyncClient.subscribe("/v1/polyhome-village/" + config.village_config.village + "/services/")
        .then(() => {
            console.log("Subscribe Success");

            //==============test============
            // let content = {"domain": "villageplugin", "service": "postfacelogger", "data": {"time": "2018-04-17", "type": 2}}
            // asyncClient.publish("/v1/polyhome-village/" + config.village_config.village + "/services/", JSON.stringify(content))
            //     .then(function(){})

            // content = {"domain": "villageplugin", "service": "postusers", "data": {}}
            // asyncClient.publish("/v1/polyhome-village/" + config.village_config.village + "/services/", JSON.stringify(content))
            //     .then(function(){})
        });
});

/**
 * 这里接收mqtt的消息
 */
asyncClient.on('message', function (topic, message){
    console.log("Topic: " + topic, "  Message: " + message.toString());

    var village_id = topic.split('/')[3];
    var json_data = JSON.parse(message.toString());
    if (json_data.domain == 'villageplugin'){
        // 开锁命令
        if (json_data.service == 'unlock'){
            if (json_data.data.type == '1'){
                dnakelock.unlockDoor(json_data.data);
            }
        }
        // 上报记录数据命令
        /**
         * {
         *    "domain": "villageplugin",
         *    "service": "postfacelogger",
         *    "data": {
         *       "date": "2018-4-13",
         *       "type": 1
         *    }
         * }
         */
        if (json_data.service == 'postfacelogger'){
            let time = json_data.data.time;
            console.log(time)
            // 提交人脸开门记录
            faceModel.getFaceLoggerByTime(time.trim(' '))
                .then((results) => {
                    results.forEach(element => {
                        delete element['id']
                        element.village_id = config.village_config.village;
                    });
                    return results;
                })
                .then((results) => {
                    console.log(results)
                    let records = {"village_id": config.village_config.village, "records": results, "type": json_data.data.type}
                    return httprequest.genPostFaceLogger(records);
                })
                .then((data) => {
                    console.log("人脸记录提交完成");
                })
                .catch(err => console.log(err));
        }
        if (json_data.service == 'postaccesslogger'){
            // 提交刷开开门记录
            let time = json_data.data.time;
            accessModel.getFaceLoggerByTime(time.trim(' '))
                .then((results) => {
                    results.forEach(element => {
                        delete element['id']
                        element.village_id = config.village_config.village;
                    });
                    return results;
                })
                .then((results) => {
                    let records = {"village_id": config.village_config.village, "records": results, "type": json_data.data.type}
                    return httprequest.genPostAccessLogger(records);
                })
                .then((data) => {
                    console.log("开门记录提交完成");
                })
                .catch(err => console.log(err));
        }
        if (json_data.service == 'postfaceusers'){
            // 提交用户记录
            usersModel.getFaceUsers()
                .then((results) => {
                    results.forEach(element => {
                        delete element['id']
                        element.village_id = config.village_config.village;
                    });
                    console.log(results);
                    return results;
                })
                .then((results) => {
                    let records = {"village_id": config.village_config.village, "records": results, "type": json_data.data.type}
                    console.log(records)
                    return httprequest.genPostUsers(records);
                })
                .then((data) => {
                    console.log("用户列表提交完成");
                })
                .catch(err => console.log(err));
        }
    }
});

module.exports = asyncClient;
