import { decrementBottleCount } from "./resource_model";
const DrinkRecipes = require('../schemas/drink_recipe');

const BatchData = require('../schemas/batch_data');

var is_finished_item = false;

const batchStatus = {
    ONGOING: 0,
    COMPLETED: 1
}

async function updateBatchData(ingredient_names, flow_rates_payload, has_batch_started) {
    is_finished_item = true;
    let drink_name;
    let current_item_count;
    let max_item_count;
    let status = batchStatus.ONGOING;
    let flow_rates = [];
    let consumption = [];
    let amounts_used = [];
    if(has_batch_started) {
        
        // STARTING BATCH DATA TO BE SENT BY DB
        try {
            let batch_data = await BatchData.find();
            //console.log(`Batch ${JSON.stringify(batch_data[batch_data.length - 1])}`);
            // Set current and max item no.
            drink_name = batch_data[batch_data.length - 1]["drink_name"];
            current_item_count = batch_data[batch_data.length - 1]["current_item_count"];
            max_item_count = batch_data[batch_data.length - 1]["max_item_count"];
            status = getBatchStatus(true, current_item_count, max_item_count);
            
            let recipe = await DrinkRecipes.findOne({name: drink_name});

            if(status == batchStatus.COMPLETED)
                return batch_data[batch_data.length - 1];

            for(let i = 0; i < flow_rates_payload["flow_rates"].length; i++) {
                let required_volume = recipe["ingredients"][i]["amount"];
                flow_rates.push(flow_rates_payload["flow_rates"][i]["flow_rate"]);
                amounts_used.push(batch_data[batch_data.length - 1]["consumption"][i]["amount_used"] + flow_rates[i] / 60);

                // Create consumption data
                consumption.push(
                    {
                        ingredient_name: ingredient_names[i],
                        amount_used: amounts_used[i],
                        rate: flow_rates[i]
                    }
                );

                //console.log(`${amounts_used[i]} | ${required_volume}`);
                // When all volumes are met, item is finished
                if(amounts_used[i] < required_volume) {
                    is_finished_item = false;
                }
            }
            
            if(is_finished_item) {
                decrementBottleCount()
                current_item_count++;
                consumption = [];
                for(let i = 0; i < ingredient_names.length; i++) {
                    // Create consumption data
                    consumption.push(
                        {
                            ingredient_name: ingredient_names[i],
                            amount_used: 0,
                            rate: flow_rates[i]
                        }
                    );
                }
            }

            status = getBatchStatus(true, current_item_count, max_item_count);

            let data = {
                drink_name: drink_name,
                current_item_count: current_item_count,
                max_item_count: max_item_count,
                consumption: consumption,
                status: status
            };

            BatchData.insertMany([data]);
            
            return data;
        } catch (error) {
            console.log(error);
        }
    }
}

function getBatchStatus(has_batch_started, current_item_count, max_item_count) {
    if(has_batch_started) {
        return current_item_count >= max_item_count ? batchStatus.COMPLETED : batchStatus.ONGOING;
    }
    return batchStatus.COMPLETED;
}

async function getLatestBatchData() {
    try {
        let data = await BatchData.find();
        return data[data.length - 1];
    } catch (error) {
        console.log(error);
    }
}

function getHasItemFinished() {
    return is_finished_item;
}

export { getLatestBatchData, updateBatchData, getHasItemFinished };