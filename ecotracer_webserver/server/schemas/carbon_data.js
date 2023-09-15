"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const CarbonDataSchema = new Schema({
    timestamp: {
        type: Date,
        default: Date.now()
    },
    carbon_target: {
        type: Number,
        required: true
    },
    carbon_rate: {
        type: Number,
        required: true
    },
}, {
    collection: "carbon_data"
});
module.exports = mongoose_1.default.model('CarbonData', CarbonDataSchema);
