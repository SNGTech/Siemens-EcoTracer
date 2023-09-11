import mongoose from 'mongoose';

const Schema = mongoose.Schema;
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

module.exports = mongoose.model('MachineStats', MachineStatsSchema);
