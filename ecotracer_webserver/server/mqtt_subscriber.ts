const mqtt = require('mqtt');

module.exports = function() {

    const host = '192.168.1.101';
    const port = 1883;

    const topics = ['liquidFlowRate', 'liquidTotalVolume', 'airFlowRate', 'supplyVoltage', 'currentRMS', 'flowTotalVolume'];

    const options = {
        clientId: 'ESP32Client',
        Username: '',
        Password: '',
        clean: true,
        connectTimeout: 4000,
        reconnectPeriod: 1000
    };

    console.log("Node.js is now running");

    const client = mqtt.connect(`mqtt://${host}:${port}`, options);

    client.on('connect', () => {
        console.log(`Connection established successfully at: mqtt://${host}:${port}`);
        // topics.forEach(topic => {
        //     client.subscribe(topic);
        //     console.log(`Subscribed to topic: ${topic}`);
        // })
        client.subscribe('liquidFlowRate', 0);
    });

    client.on('message', function(topic, message) {
        console.log(`Listening to topic [${topic}]: Message is ${message}`);
    });
}



