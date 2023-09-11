require("dotenv").config();

import express from 'express';
import layouts from 'express-ejs-layouts';
import mongoose from 'mongoose';
const MachineStats = require('./server/machine_stats');
const MachineInfoData = require('./server/machine_info');
const DrinkRecipes = require('./server/drink_recipe');
const BatchData = require('./server/batch_data');

const app = express();
const PORT = 5000;

const connectMongoDB = async() => {
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Connected to Database at host: ${conn.connection.host}`);
  } catch(error) {
    console.log(error);
  } 
};

connectMongoDB();

app.use(express.static('static'));

app.use(express.json());
app.use(layouts);
app.set('layout', './layout/main');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(PORT, () => {
    console.log(`App listening on Port: ${PORT}`);
})

function randDouble(min: number, max: number, precision: number) {
    return parseFloat((min + (max - min) * Math.random()).toFixed(precision));
}

var is_on = false;
var is_valves_opened = false;
var is_batching = false;
var batch_count = false;

var current;
var voltage;
var volumes_flow_rate = [];
var valves_status = []; // false - close, true - open (meant to increment bottle usage)
var energy_rate;
var current_batch = 0;
var item_completed_flag = false;
var batch_count_json;

var selected_drink_index = 0;

MachineInfoData.insertMany([
    {
        max_water_volume: 2000,
        water_volume: 2000,
        max_milk_volume: 1000,
        milk_volume: 1000,
        max_tea_volume: 2204,
        tea_volume: 2204,
        max_bottle_count: 2304,
        bottle_count: 2304
    }
]);

// INITIALISE SOME MAIN DRINKS FOR TESTING
const add_test_recipes = async () => { 
    if(await DrinkRecipes.count() == 0)
        DrinkRecipes.insertMany([
            {
                name: "Black Tea",
                ingredients: [
                    {
                        ingredient_name: "Water",
                        amount: 0.25
                    },
                    {
                        ingredient_name: "Tea",
                        amount: 0.8
                    },
                    {
                        ingredient_name: "Milk",
                        amount: 0
                    }
                ]
            },
            {
                name: "Cow's Milk",
                ingredients: [
                    {
                        ingredient_name: "Water",
                        amount: 0
                    },
                    {
                        ingredient_name: "Tea",
                        amount: 0
                    },
                    {
                        ingredient_name: "Milk",
                        amount: 1.25
                    }
                ]
            }
        ])
}

add_test_recipes();


/************************************* GET REQUESTS *************************************/

app.get('/pub_data', async (req, res) => {
    let result;
    try {
        result = await MachineStats.find();
        
        current = is_on ? randDouble(4.4, 4.5, 2) : 0;
        voltage = is_on ? randDouble(220, 230, 2) : 0;
        volumes_flow_rate = [];
        volumes_flow_rate.push(is_batching && is_on && is_valves_opened && valves_status[0] ? randDouble(1.45, 2.45, 4) : 0);
        volumes_flow_rate.push(is_batching && is_on && is_valves_opened && valves_status[1] ? randDouble(2, 4.43, 4) : 0);
        volumes_flow_rate.push(is_batching && is_on && is_valves_opened && valves_status[2] ? randDouble(2.45, 3.67, 4) : 0);
        energy_rate = is_on ? randDouble(0.0276756, 0.0376756, 8) * (is_batching ? 2 : 1) : 0;
        batch_count_json = is_batching ? batch_count : 0;
        MachineStats.insertMany([
            {
                is_on: is_on,
                current: current,
                voltage: voltage,
                flow_rates: [
                    {
                        name: 'Water',
                        flow_rate: volumes_flow_rate[0]
                    },
                    {
                        name: 'Tea',
                        flow_rate: volumes_flow_rate[1]
                    },
                    {
                        name: 'Milk',
                        flow_rate: volumes_flow_rate[2]
                    },
                ],
                energy_rate: energy_rate,
                batch_count: batch_count_json,
                current_batch_count: current_batch,
                has_batch_started: is_batching
            }
        ]);

        if(is_batching) {
            await handleBatchEvent();
        }

    } catch (error) {
        console.log(error);
    }
    res.send(result);
})

app.get('/pub_info_data', async (req, res) => {
    let result;
    try {
        result = await MachineInfoData.find();

        let max_volumes = [];
        let current_volumes = [];
        max_volumes.push(result[result.length - 1].max_water_volume);
        max_volumes.push(result[result.length - 1].max_tea_volume);
        max_volumes.push(result[result.length - 1].max_milk_volume);
        current_volumes.push(result[result.length - 1].water_volume - (volumes_flow_rate[0] / 60));
        current_volumes.push(result[result.length - 1].tea_volume - (volumes_flow_rate[1] / 60));
        current_volumes.push(result[result.length - 1].milk_volume - (volumes_flow_rate[2] / 60));
        const bottle_count = result[result.length - 1].bottle_count - (item_completed_flag ? 1 : 0);
        const max_bottle_count = result[result.length - 1].max_bottle_count;
        item_completed_flag = false;

        MachineInfoData.insertMany([
            {
                max_water_volume: max_volumes[0],
                water_volume: current_volumes[0],
                max_tea_volume: max_volumes[1],
                tea_volume: current_volumes[1],
                max_milk_volume: max_volumes[2],
                milk_volume: current_volumes[2],
                max_bottle_count: max_bottle_count,
                bottle_count: bottle_count
            }
        ]);
        console.log(`Water: \x1b[36m${current_volumes[0].toFixed(2)} litres \x1b[0m| Tea: \x1b[32m${current_volumes[1].toFixed(2)} litres \x1b[0m| Milk: \x1b[1m${current_volumes[2].toFixed(2)} litres \x1b[0m\| Bottles: \x1b[35m${bottle_count}\x1b[0m`)
    } catch (error) {
        console.log(error);
    }
    res.send(result);
})

app.get('/pub_batch_data', async (req, res) => {
    let result;
    try {
        result = await BatchData.find();
    } catch (error) {
        console.log(error);
    }
    res.send(result);
})

async function handleBatchEvent() {
    try {
        const drinkRecipes = await DrinkRecipes.find();
        const drinkRecipe = drinkRecipes[selected_drink_index];
        const batchData = await BatchData.find();

        const required_volumes = drinkRecipe.ingredients.map(e => e.amount);
        //console.log(required_volumes);
        let consumption_arr = [];
        let is_item_done = true;
        for(let i = 0; i < drinkRecipe.ingredients.length; i++) {
            let last_amount_used = 0;
            let volume_used = 0;
            if(await BatchData.count() > 0) {
                if(batchData[batchData.length - 1].current_num == current_batch) {
                    last_amount_used = batchData[batchData.length - 1].consumption[i].amount_used;
                }
                //console.log(`${batchData[batchData.length - 1].current_num} | ${current_batch}`);
            }
            //console.log(`Amount: ${last_amount_used} | Flow: ${volumes_flow_rate[i] / 60}`);
            volume_used = last_amount_used + volumes_flow_rate[i] / 60;
            //console.log(`Volume Used: ${volumes_used}`);
            //console.log(`Prev used: ${last_amount_used} | Current used: ${volume_used}`);
            let consumption_element = {
                ingredient_name: drinkRecipe.ingredients[i].ingredient_name,
                amount_used: volume_used,
                rate: volumes_flow_rate[i] / 60
            };
            consumption_arr.push(consumption_element);

            //console.log(`Consumption: ${volume_used} | ${drinkRecipe.ingredients[i].amount}`);
            if(volume_used < drinkRecipe.ingredients[i].amount) {
                is_item_done = false;
                valves_status[i] = true;
            } else valves_status[i] = false;
        }
        //console.log(consumption_arr);

        BatchData.insertMany([
            {
                drink_name: drinkRecipe.name,
                current_num: current_batch,
                max_num: batch_count_json,
                consumption: consumption_arr
            }
        ]);

        if(is_item_done) {
            item_completed_flag = true;
            current_batch++;
            //console.log("Item completed");
        } //else console.log("Item not done");

        if(current_batch >= batch_count_json) {
            resetBatch();
        }
    } catch (error) {
        console.log(error);
    }
}

function resetBatch() {
    current_batch = 0;
    is_batching = false;
}

/************************************* POST REQUESTS *************************************/

app.post('/power_toggle', (req, res) => {
    let _is_on = req.body.is_power_on;
    console.log(_is_on ? "Turned Machine ON" : "Turned Machine OFF");

    is_on = _is_on;

    res.sendStatus(200);
});

app.post('/fluid_valves', (req, res) => {
    let _is_opened = req.body.is_valves_opened;
    console.log(_is_opened ? "OPENED Fluid Valves" : "CLOSED Fluid Valves");

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