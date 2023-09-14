const mqtt = require('mqtt');

var client;
var data;

const host = '192.168.213.38';
const port = 1883;

const topic = 'ecotracer/data';

const options = {
    clean: true,
    username: '',
    password: '',
    connectTimeout: 4000,
    reconnectPeriod: 1000
};

function connectAndSubscribe() {
    client = mqtt.connect(`mqtt://${host}:${port}`, options);

    client.on('connect', () => {
        console.log(`Connection established successfully at: mqtt://${host}:${port}`);
        client.subscribe(topic, () => console.log(`Subscribed to topic: ${topic}`));
    });

    client.on('message', (topic, message) => {
        data = message;
    });
}

function getData() {
    return data != null ? JSON.parse(data) : "No Data";
};

export { connectAndSubscribe, getData };



