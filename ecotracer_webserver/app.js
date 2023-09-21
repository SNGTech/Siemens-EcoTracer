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
const flow_rate_model_1 = require("./server/models/flow_rate_model");
const batching_model_1 = require("./server/models/batching_model");
const carbon_model_1 = require("./server/models/carbon_model");
const BatchData = require('./server/schemas/batch_data');
const app = (0, express_1.default)();
const PORT = 5000;
var has_batch_started = false;
app.use(express_1.default.json());
app.listen(PORT, () => {
    console.log(`Express App listening on Port: ${PORT}`);
    (0, resource_model_1.initBottleCount)();
});
(0, mqtt_subscriber_1.connectAndSubscribe)();
(0, mongodb_1.connectMongoDB)();
// INITIAL PHASE
(0, recipe_model_1.add_test_recipes)();
(0, resource_model_1.resetModel)();
(0, flow_rate_model_1.resetFlowRate)((0, resource_model_1.getIngredientNames)());
// WEBSERVER CODE
app.get('/', (req, res) => {
    res.send('Ecotracer Webserver is Running');
});
function randDouble(min, max, precision) {
    return parseFloat((min + (max - min) * Math.random()).toFixed(precision));
}
// GET MACHINE STATS DATA
app.get('/pub_stats', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield (0, stats_model_1.getMachineStatsData)();
    res.send(result);
}));
// GET LATEST BATCH DATA
app.get('/pub_batch_data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield (0, batching_model_1.getLatestBatchData)();
    res.send(result);
}));
// GET RESOURCES DATA
app.get('/pub_res_data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield (0, resource_model_1.getResourcesData)();
    console.log(result);
    res.send(result);
}));
// GET CARBON DATA
app.get('/pub_carbon_data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield (0, carbon_model_1.getCarbonDataHourly)();
    console.log(result);
    res.send(result);
}));
// POST START BATCHING SIGNAL
app.post('/post_start_batching', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let drink_name = 0; // GET RESPONSE DRINK NAME;
    let max_item_count = 0; // GET RESPONSE MAX ITEM COUNT
    let consumption = [];
    for (let i = 0; i < (0, resource_model_1.getIngredientNames)().length; i++) {
        // Create consumption data
        consumption.push({
            ingredient_name: (0, resource_model_1.getIngredientNames)()[i],
            amount_used: 0,
            rate: 0
        });
    }
    BatchData.insertMany([{
            drink_name: drink_name,
            current_item_count: 0,
            max_item_count: max_item_count,
            consumption: consumption,
            status: 0
        }]);
    console.log(`Started Batch: ` + drink_name);
    has_batch_started = true;
}));
// UPDATE RESOURCES BASE ON FLOW RATE
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    if ((yield (0, batching_model_1.getLatestBatchData)()) != null) {
        yield (0, flow_rate_model_1.updateFlowRates)((0, mqtt_subscriber_2.getData)(), (0, resource_model_1.getIngredientNames)(), yield (0, batching_model_1.getLatestBatchData)());
        yield (0, batching_model_1.updateBatchData)((0, resource_model_1.getIngredientNames)(), yield (0, flow_rate_model_1.getFlowRate)(), has_batch_started);
        console.log(yield (0, batching_model_1.getLatestBatchData)());
    }
    yield (0, resource_model_1.updateResources)(yield (0, flow_rate_model_1.getFlowRate)());
    if ((0, mqtt_subscriber_2.getData)() != "No Data")
        (0, stats_model_1.updateMachineStats)((0, mqtt_subscriber_2.getData)(), has_batch_started); // ENABLE WHEN DATA IS COLLECTING
    //updateCarbonData(await getMachineStatsData());
    //console.log(data);
}), 1000);
// DEBUG START BATCH
// setInterval(async () => {
//     console.log(`Started Batch`);
//     if(await BatchData.count() <= 0) {
//     BatchData.insertMany([{
//         drink_name: "Black Tea",
//         current_item_count: 0,
//         max_item_count: 5,
//         consumption: [
//             {
//                 ingredient_name: "Water",
//                 amount_used: 0,
//                 rate: 0
//             },
//             {
//                 ingredient_name: "Tea",
//                 amount_used: 0,
//                 rate: 0
//             },
//             {
//                 ingredient_name: "Milk",
//                 amount_used: 0,
//                 rate: 0
//             }
//         ],
//         status: 0
//     }]);
// }
// has_batch_started = true;
// }, 5000);
// ENABLE DEBUGGING DISPLAY DATA
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Received data: ${(0, mqtt_subscriber_2.getData)()}`);
    // DEBUG FETCH
    // END DEBUG FETCH
    console.log(`Get Data: ${yield (0, stats_model_1.getMachineStatsData)()}`);
}), 1000);
