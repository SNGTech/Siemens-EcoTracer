"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const MachineStatsSchema = new Schema({
    timestamp: {
        type: Date,
        default: Date.now()
    },
    is_on: {
        type: Boolean,
        required: true
    },
    current: {
        type: Number,
        required: true
    },
    voltage: {
        type: Number,
        required: true
    },
    flow_rates: {
        type: [{
                name: String,
                flow_rate: Number
            }],
        default: {}
    },
    energy_rate: {
        type: Number,
        required: true
    },
    batch_count: {
        type: Number,
        required: true
    },
    current_batch_count: {
        type: Number,
        required: true
    },
    has_batch_started: {
        type: Boolean,
        required: true
    }
}, {
    collection: "machine_stats"
});
module.exports = mongoose_1.default.model('MachineStats', MachineStatsSchema);
