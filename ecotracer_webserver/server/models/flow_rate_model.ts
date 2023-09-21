const FlowRates = require('../schemas/flow_rates');
const DrinkRecipes = require('../schemas/drink_recipe');

// WATER (INDEX 0) is taken from machine
var def_flow_rates = [0.2, 1.4, 1.6];

// RESET FLOW RATES
function resetFlowRate(ingredient_names) {
    let data = ingredient_names.map((name, i) => {
        return {
            name: name,
            flow_rate: 0
        };
    })

    FlowRates.insertMany([
        {
            flow_rates: data
        }
    ]);
}

async function getFlowRate() {
    try {
        let flow_rates_collection = await FlowRates.find();
        return flow_rates_collection[flow_rates_collection.length - 1];
    } catch (error) {
        console.log(error);
    }
}

// batch_payload is single item, recipe_payload is multi-item
async function updateFlowRates(data_payload, ingredient_names, batch_payload) {
    let flow_rates = [];
    try {
        let recipe = await DrinkRecipes.findOne({name: batch_payload["drink_name"]});

        //console.log(recipe)
        // Reset Flow Rates
        if(batch_payload["status"] == 1) {
            let data = ingredient_names.map((name, i) => { return {
                name: name,
                flow_rate: 0
            };
            });
            FlowRates.insertMany([{
                flow_rates: data
            }]); 

            return data;
        }

        // Loop through all ingredients
        let data = ingredient_names.map((name, i) => {
            let required_volume = recipe["ingredients"][i]["amount"];
            //console.log(`Batch ${JSON.stringify(batch_payload["consumption"][i])}`);
            let amount_used = batch_payload["consumption"][i]["amount_used"];

            // If still ongoing
            if(amount_used >= required_volume) {
                flow_rates.push(0);
            } else {
                // Use water flow rate data from machine, the rest is simulated
                // if(i == 0) {
                //     flow_rates.push(data_payload["liquidFlowRate"]);
                //     console.log(`Liquid: ${data_payload["liquidFlowRate"]}`);
                // } else
                    flow_rates.push(def_flow_rates[i]);
                }

            return {
                name: name,
                flow_rate: flow_rates[i]
            };
        });


        FlowRates.insertMany([{
            flow_rates: data
        }]); 

        return data;
    } catch (error) {
        console.log(error);
    }
}

export { resetFlowRate, getFlowRate, updateFlowRates };