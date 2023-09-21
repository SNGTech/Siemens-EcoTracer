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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFlowRates = exports.getFlowRate = exports.resetFlowRate = void 0;
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
    });
    FlowRates.insertMany([
        {
            flow_rates: data
        }
    ]);
}
exports.resetFlowRate = resetFlowRate;
function getFlowRate() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let flow_rates_collection = yield FlowRates.find();
            return flow_rates_collection[flow_rates_collection.length - 1];
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.getFlowRate = getFlowRate;
// batch_payload is single item, recipe_payload is multi-item
function updateFlowRates(data_payload, ingredient_names, batch_payload) {
    return __awaiter(this, void 0, void 0, function* () {
        let flow_rates = [];
        try {
            let recipe = yield DrinkRecipes.findOne({ name: batch_payload["drink_name"] });
            //console.log(recipe)
            // Reset Flow Rates
            if (batch_payload["status"] == 1) {
                let data = ingredient_names.map((name, i) => {
                    return {
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
                if (amount_used >= required_volume) {
                    flow_rates.push(0);
                }
                else {
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
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.updateFlowRates = updateFlowRates;
