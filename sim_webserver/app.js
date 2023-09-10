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
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const express_ejs_layouts_1 = __importDefault(require("express-ejs-layouts"));
const mongoose_1 = __importDefault(require("mongoose"));
const MachineStats = require('./server/machine_stats');
const MachineInfoData = require('./server/machine_info');
const DrinkRecipes = require('./server/drink_recipe');
const app = (0, express_1.default)();
const PORT = 5000;
const connectMongoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        mongoose_1.default.set('strictQuery', false);
        const conn = yield mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log(`Connected to Database at host: ${conn.connection.host}`);
    }
    catch (error) {
        console.log(error);
    }
});
connectMongoDB();
app.use(express_1.default.static('static'));
app.use(express_1.default.json());
app.use(express_ejs_layouts_1.default);
app.set('layout', './layout/main');
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    res.render('index');
});
app.listen(PORT, () => {
    console.log(`App listening on Port: ${PORT}`);
});
function randDouble(min, max, precision) {
    return parseFloat((min + (max - min) * Math.random()).toFixed(precision));
}
var is_on = false;
var is_valves_opened = false;
var is_batching = false;
var batch_count = false;
var current;
var voltage;
var water_flow_rate;
var energy_rate;
var batch_count_json;
var selected_drink_index = 0;
MachineInfoData.insertMany([
    {
        max_water_volume: 2000,
        water_volume: 2000,
        milk_volume: 1000,
        tea_volume: 2204,
        bottle_count: 2304
    }
]);
// INITIALISE SOME MAIN DRINKS FOR TESTING
const add_test_recipes = () => __awaiter(void 0, void 0, void 0, function* () {
    if ((yield DrinkRecipes.count()) == 0)
        DrinkRecipes.insertMany([
            {
                name: "Black Tea",
                ingredients: [
                    {
                        ingredient_name: "Tea",
                        amount: 0.8
                    },
                    {
                        ingredient_name: "Water",
                        amount: 0.25
                    }
                ]
            },
            {
                name: "Cow's Milk",
                ingredients: [
                    {
                        ingredient_name: "Milk",
                        amount: 1.25
                    }
                ]
            }
        ]);
});
add_test_recipes();
/************************************* GET REQUESTS *************************************/
app.get('/pub_data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        result = yield MachineStats.find();
        current = is_on ? randDouble(4.4, 4.5, 2) : 0;
        voltage = is_on ? randDouble(220, 230, 2) : 0;
        water_flow_rate = is_batching && is_on && is_valves_opened ? randDouble(23.21, 45, 4) : 0;
        energy_rate = is_on ? randDouble(0.0276756, 0.0376756, 8) * (is_batching ? 2 : 1) : 0;
        batch_count_json = is_batching ? batch_count : 0;
        MachineStats.insertMany([
            {
                is_on: is_on,
                current: current,
                voltage: voltage,
                water_flow_rate: water_flow_rate,
                energy_rate: energy_rate,
                batch_count: batch_count_json,
                has_batch_started: is_batching
            }
        ]);
    }
    catch (error) {
        console.log(error);
    }
    res.send(result);
}));
app.get('/pub_info_data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        result = yield MachineInfoData.find();
        const max_water_volume = result[result.length - 1].max_water_volume;
        const water_volume = result[result.length - 1].water_volume - (water_flow_rate / 60);
        MachineInfoData.insertMany([
            {
                max_water_volume: max_water_volume,
                water_volume: water_volume,
                milk_volume: 0,
                tea_volume: 0,
                bottle_count: 0
            }
        ]);
    }
    catch (error) {
        console.log(error);
    }
    res.send(result);
}));
/************************************* POST REQUESTS *************************************/
app.post('/power_toggle', (req, res) => {
    let _is_on = req.body.is_power_on;
    console.log(_is_on ? "Turned Machine ON" : "Turned Machine OFF");
    is_on = _is_on;
    res.sendStatus(200);
});
app.post('/water_valves', (req, res) => {
    let _is_opened = req.body.is_valves_opened;
    console.log(_is_opened ? "OPENED Water Valves" : "CLOSED Water Valves");
    is_valves_opened = _is_opened;
    res.sendStatus(200);
});
app.post('/batching', (req, res) => {
    let _is_batching = req.body.is_batching;
    let _batch_count = req.body.batch_count;
    console.log(_is_batching ? "Started Making Batch" : "Stopped Making Batch");
    is_batching = _is_batching;
    batch_count = _batch_count;
    res.sendStatus(200);
});
app.post('/select_drink', (req, res) => {
    let _drink_index = req.body.drink_index;
    console.log(_drink_index == 0 ? "Selected: Black Tea" : "Selected: Cow's Milk");
    selected_drink_index = _drink_index;
    res.sendStatus(200);
});
