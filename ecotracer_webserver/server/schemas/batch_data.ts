import mongoose from 'mongoose';

const Schema = mongoose.Schema;
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
    },
    status: {
        type: Number,
        required: true
    }
}, {
    collection: "batch_data"
});

module.exports = mongoose.model('BatchData', BatchDataSchema);