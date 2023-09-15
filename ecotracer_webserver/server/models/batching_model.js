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
exports.updateBatchData = exports.getLatestBatchData = void 0;
const BatchData = require('../schemas/batch_data');
const batchStatus = {
    ONGOING: 0,
    COMPLETED: 1
};
function updateBatchData(ingredient_names, flow_rates_payload, has_batch_started) {
    return __awaiter(this, void 0, void 0, function* () {
        let is_finished_item = true;
        let drink_name;
        let current_item_count;
        let max_item_count;
        let status = batchStatus.ONGOING;
        let flow_rates = [];
        let consumption = [];
        let amounts_used = [];
        if (has_batch_started) {
            // STARTING BATCH DATA TO BE SENT BY DB
            try {
                let batch_data = yield BatchData.find();
                //console.log(`Batch ${JSON.stringify(batch_data[batch_data.length - 1])}`);
                // Set current and max item no.
                drink_name = batch_data[batch_data.length - 1]["drink_name"];
                current_item_count = batch_data[batch_data.length - 1]["current_item_count"];
                max_item_count = batch_data[batch_data.length - 1]["max_item_count"];
                status = getBatchStatus(true, current_item_count, max_item_count);
                if (status == batchStatus.COMPLETED)
                    return batch_data[batch_data.length - 1];
                for (let i = 0; i < flow_rates_payload["flow_rates"].length; i++) {
                    flow_rates.push(flow_rates_payload["flow_rates"][i]["flow_rate"]);
                    amounts_used.push(batch_data[batch_data.length - 1]["consumption"][i]["amount_used"] + flow_rates[i] / 60);
                    // Create consumption data
                    consumption.push({
                        ingredient_name: ingredient_names[i],
                        amount_used: amounts_used[i],
                        rate: flow_rates[i]
                    });
                    // When all flow rates are 0 -> item is finished
                    if (flow_rates[i] > 0) {
                        is_finished_item = false;
                    }
                }
                // TODO: ENSURE IT ONLY ACTIVATES ONCE AFTER EVERY ITEM COMPLETION
                if (is_finished_item) {
                    current_item_count++;
                    consumption = [];
                    for (let i = 0; i < ingredient_names.length; i++) {
                        // Create consumption data
                        consumption.push({
                            ingredient_name: ingredient_names[i],
                            amount_used: 0,
                            rate: flow_rates[i]
                        });
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
            }
            catch (error) {
                console.log(error);
            }
        }
    });
}
exports.updateBatchData = updateBatchData;
function getBatchStatus(has_batch_started, current_item_count, max_item_count) {
    if (has_batch_started) {
        return current_item_count >= max_item_count ? batchStatus.COMPLETED : batchStatus.ONGOING;
    }
    return batchStatus.COMPLETED;
}
function getLatestBatchData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let data = yield BatchData.find();
            return data[data.length - 1];
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.getLatestBatchData = getLatestBatchData;
