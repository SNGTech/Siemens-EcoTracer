"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mqtt_subscriber_1 = require("./server/mqtt_subscriber");
const mqtt_subscriber_2 = require("./server/mqtt_subscriber");
const mongodb_1 = require("./server/mongodb");
const stats_model_1 = require("./server/models/stats_model");
const recipe_model_1 = require("./server/models/recipe_model");
const express_1 = __importDefault(require("express"));
const resource_model_1 = require("./server/models/resource_model");
const app = (0, express_1.default)();
const PORT = 5000;
app.use(express_1.default.json());
app.listen(PORT, () => {
    console.log(`Express App listening on Port: ${PORT}`);
});
(0, mqtt_subscriber_1.connectAndSubscribe)();
(0, mongodb_1.connectMongoDB)();
// INITIAL PHASE
(0, recipe_model_1.add_test_recipes)();
(0, resource_model_1.resetModel)();
// WEBSERVER CODE
app.get('/', (req, res) => {
    res.send('Ecotracer Webserver is Running');
});
function randDouble(min, max, precision) {
    return parseFloat((min + (max - min) * Math.random()).toFixed(precision));
}
// GET MACHINE STATS DATA
app.get('/pub_stats', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield (0, stats_model_1.updateMachineStats)((0, mqtt_subscriber_2.getData)(), false, req, res);
    res.send(result);
}));
// UPDATE RESOURCES BASE ON FLOW RATE
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    let data = yield (0, resource_model_1.updateResources)([10, 20, 30], false);
    //console.log(data);
}), 1000);
// ENABLE DEBUGGING DISPLAY DATA
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Received data: ${(0, mqtt_subscriber_2.getData)()}`);
    // DEBUG FETCH
    // END DEBUG FETCH
    console.log(`Get Data: ${yield (0, stats_model_1.getMachineStatsData)()}`);
}), 1000);
