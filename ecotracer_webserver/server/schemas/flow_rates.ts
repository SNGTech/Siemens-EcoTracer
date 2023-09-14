import mongoose from 'mongoose';

const Schema = mongoose.Schema;
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

module.exports = mongoose.model('FlowRates', FlowRatesSchema);