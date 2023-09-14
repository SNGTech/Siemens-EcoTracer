"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const BatchDataSchema = new Schema({
    drink_name: {
        type: String,
        required: true
    },
    current_item_count: {
        type: Number,
        required: true
    },
    max_item_count: {
        type: Number,
        required: true
    },
    consumption: {
        type: [{
                ingredient_name: String,
                amount_used: Number,
                rate: Number
            }],
        default: {}
    }
}, {
    collection: "batch_data"
});
module.exports = mongoose_1.default.model('BatchData', BatchDataSchema);
