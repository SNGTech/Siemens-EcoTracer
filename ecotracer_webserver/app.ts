import { connectAndSubscribe } from "./server/mqtt_subscriber";
import { getData } from "./server/mqtt_subscriber";
import { connectMongoDB } from "./server/mongodb";
import { getMachineStatsData, updateMachineStats } from "./server/models/stats_model";
import { add_test_recipes } from "./server/models/recipe_model";
import express from 'express';
import { resetModel, updateResources } from "./server/models/resource_model";

const app = express();
const PORT = 5000;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Express App listening on Port: ${PORT}`);
})

connectAndSubscribe();
connectMongoDB();

// INITIAL PHASE

add_test_recipes();
resetModel();

// WEBSERVER CODE

app.get('/', (req, res) => {
    res.send('Ecotracer Webserver is Running');
});

function randDouble(min: number, max: number, precision: number) {
    return parseFloat((min + (max - min) * Math.random()).toFixed(precision));
}

// GET MACHINE STATS DATA
app.get('/pub_stats', async (req, res) => {
    let result = await updateMachineStats(getData(), false, req, res);
    res.send(result);
});

// UPDATE RESOURCES BASE ON FLOW RATE
setInterval(async() => {
    let data = await updateResources([10, 20, 30], false);
    //console.log(data);
}, 1000);




// ENABLE DEBUGGING DISPLAY DATA
setInterval(async () => {
    console.log(`Received data: ${getData()}`);

    // DEBUG FETCH
    // END DEBUG FETCH

    console.log(`Get Data: ${await getMachineStatsData()}`);
}, 1000);


