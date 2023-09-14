"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const FlowRatesSchema = new Schema({
    timestamp: {
        type: Date,
        default: Date.now()
    },
    flow_rates: {
        type: [{
                name: String,
                flow_rate: Number
            }],
        default: {}
    }
}, {
    collection: "flow_rates"
});
module.exports = mongoose_1.default.model('FlowRates', FlowRatesSchema);
