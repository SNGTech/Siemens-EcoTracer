"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mqtt_subscriber_1 = require("./server/mqtt_subscriber");
const mqtt_subscriber_2 = require("./server/mqtt_subscriber");
const mongodb_1 = require("./server/mongodb");
(0, mqtt_subscriber_1.connectAndSubscribe)();
(0, mongodb_1.connectMongoDB)();
// ENABLE DEBUGGING DISPLAY DATA
setInterval(() => console.log(`Received data: ${(0, mqtt_subscriber_2.getData)()}`), 1000);
