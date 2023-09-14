"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const MachineResourcesDataSchema = new Schema({
    volume_data: {
        type: [{
                ingredient_name: String,
                max_volume: Number,
                current_volume: Number
            }],
        default: {}
    },
    max_bottle_count: {
        type: Number,
        required: true
    },
    bottle_count: {
        type: Number,
        required: true
    }
}, {
    collection: "machine_resources"
});
module.exports = mongoose_1.default.model('MachineResourcesData', MachineResourcesDataSchema);
