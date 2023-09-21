import { connectAndSubscribe } from "./server/mqtt_subscriber";
import { getData } from "./server/mqtt_subscriber";
import { connectMongoDB } from "./server/mongodb";
import { getMachineStatsData, updateMachineStats } from "./server/models/stats_model";
import { add_test_recipes, getRecipes } from "./server/models/recipe_model";
import express from 'express';
import { resetModel, updateResources, getResourcesData, getIngredientNames, initBottleCount } from "./server/models/resource_model";
import { resetFlowRate, getFlowRate, updateFlowRates } from "./server/models/flow_rate_model";
import { getLatestBatchData, updateBatchData } from "./server/models/batching_model";
import { getCarbonDataHourly, updateCarbonData } from "./server/models/carbon_model";
const BatchData = require('./server/schemas/batch_data');
const app = express();
const PORT = 5000;

var has_batch_started = false;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Express App listening on Port: ${PORT}`);
    initBottleCount();
})

connectAndSubscribe();
connectMongoDB();

// INITIAL PHASE

add_test_recipes();
resetModel();
resetFlowRate(getIngredientNames());

// WEBSERVER CODE

app.get('/', (req, res) => {
    res.send('Ecotracer Webserver is Running');
});

function randDouble(min: number, max: number, precision: number) {
    return parseFloat((min + (max - min) * Math.random()).toFixed(precision));
}

// GET MACHINE STATS DATA
app.get('/pub_stats', async (req, res) => {
    let result = await getMachineStatsData();
    res.send(result);
});

// GET LATEST BATCH DATA
app.get('/pub_batch_data', async (req, res) => {
    let result = await getLatestBatchData();
    res.send(result);
});

// GET RESOURCES DATA
app.get('/pub_res_data', async (req, res) => {
    let result = await getResourcesData();
    console.log(result);
    res.send(result);
});

// GET CARBON DATA
app.get('/pub_carbon_data', async (req, res) => {
    let result = await getCarbonDataHourly();
    console.log(result);
    res.send(result);
});

// POST START BATCHING SIGNAL
app.post('/post_start_batching', async (req, res) => {

    let drink_name = 0;// GET RESPONSE DRINK NAME;
    let max_item_count = 0; // GET RESPONSE MAX ITEM COUNT

    let consumption = [];
    for(let i = 0; i < getIngredientNames().length; i++) {
        // Create consumption data
        consumption.push(
            {
                ingredient_name: getIngredientNames()[i],
                amount_used: 0,
                rate: 0
            }
        );
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
});

// UPDATE RESOURCES BASE ON FLOW RATE

setInterval(async() => {
    if(await getLatestBatchData() != null) {
        await updateFlowRates(getData(), getIngredientNames(), await getLatestBatchData());
        await updateBatchData(getIngredientNames(), await getFlowRate(), has_batch_started);
        console.log(await getLatestBatchData());
    }
    await updateResources(await getFlowRate());
    if(getData() != "No Data")
        updateMachineStats(getData(), has_batch_started); // ENABLE WHEN DATA IS COLLECTING
    //updateCarbonData(await getMachineStatsData());
    //console.log(data);
}, 1000);

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
setInterval(async () => {
    console.log(`Received data: ${getData()}`);

    // DEBUG FETCH
    // END DEBUG FETCH

    console.log(`Get Data: ${await getMachineStatsData()}`);
}, 1000);


