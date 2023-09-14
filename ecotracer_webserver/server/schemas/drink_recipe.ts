import mongoose from 'mongoose';

const Schema = mongoose.Schema;
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
        default: {}
    }
}, {
    collection: "drink_recipes"
});

module.exports = mongoose.model('DrinkRecipes', DrinkRecipeSchema);