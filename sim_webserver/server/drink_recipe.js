"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const DrinkRecipeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    ingredients: {
        type: [{
                ingredient_name: String,
                amount: Number
            }],
        default: undefined
    }
}, {
    collection: "drink_recipes"
});
module.exports = mongoose_1.default.model('DrinkRecipes', DrinkRecipeSchema);
