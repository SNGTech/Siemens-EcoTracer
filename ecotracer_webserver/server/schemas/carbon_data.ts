import mongoose from 'mongoose';

const Schema = mongoose.Schema;
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

module.exports = mongoose.model('CarbonData', CarbonDataSchema);
