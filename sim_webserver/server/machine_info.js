"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const MachineInfoDataSchema = new Schema({
    max_water_volume: {
        type: Number,
        required: true
    },
    water_volume: {
        type: Number,
        required: true
    },
    milk_volume: {
        type: Number,
        required: true
    },
    tea_volume: {
        type: Number,
        required: true
    },
    bottle_count: {
        type: Number,
        required: true
    }
}, {
    collection: "machine_info_data"
});
module.exports = mongoose_1.default.model('MachineInfoData', MachineInfoDataSchema);
