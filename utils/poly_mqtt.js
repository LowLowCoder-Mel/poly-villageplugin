'use strict'

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
    clientId: "polyhome_village_plugin_" + config.village_config.village
});

asyncClient.on('connect', function () {
    console.log('MQ Success Connect');
    
    asyncClient.subscribe("/v1/polyhome-village/" + config.village_config.village + "/services/")
        .then(() => {
            console.log("Subscribe Success");
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
        switch(json_data.service){
            case "unlock":
                try {
                    if (json_data.data.type == '1'){
                        dnakelock.unlockDoor(json_data.data);
                    }
                } catch (error) {
                    console.log(error)
                }
            break;
            case "postfacelogger":
                let face_time = json_data.data.time;
                // 提交人脸开门记录
                faceModel.getFaceLoggerByTime(face_time.trim(' '))
                    .then((results) => {
                        results.forEach(element => {
                            delete element['id'];
                            element.village_id = config.village_config.village;
                        });
                        return results;
                    })
                    .then((results) => {
                        let records = {"village_id": config.village_config.village, "records": results, "type": json_data.data.type}
                        return httprequest.genPostFaceLogger(records);
                    })
                    .then((data) => {
                        console.log("人脸记录提交完成");
                    })
                    .catch(err => console.log(err));
            break;
            case "postaccesslogger":
                // 提交刷开开门记录
                let access_time = json_data.data.time;
                accessModel.getFaceLoggerByTime(access_time.trim(' '))
                    .then((results) => {
                        results.forEach(element => {
                            delete element['id'];
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
            break;
            case "postfaceusers":
                // 提交用户记录
                usersModel.getFaceUsers()
                    .then((results) => {
                        results.forEach(element => {
                            delete element['id'];
                            element.village_id = config.village_config.village;
                        });
                        return results;
                    })
                    .then((results) => {
                        let records = {"village_id": config.village_config.village, "records": results, "type": json_data.data.type}
                        return httprequest.genPostUsers(records);
                    })
                    .then((data) => {
                        console.log("用户列表提交完成");
                    })
                    .catch(err => console.log(err));
            break;
            default:
                console.log('Command Not Support');
            break;
        }
    }
});

module.exports = asyncClient;
