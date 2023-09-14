const FlowRates = require('../schemas/flow_rates');

async function updateFlowRates(batch_payload, recipe_payload) {
    let amounts_used = [];
    let required_volumes = [];
    try {
        batch_payload[batch_payload.length - 1]["consumption"]
    } catch (error) {
        console.log(error);
    }
}