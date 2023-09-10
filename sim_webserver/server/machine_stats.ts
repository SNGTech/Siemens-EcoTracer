import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const MachineStatsSchema = new Schema({
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
    water_flow_rate: {
        type: Number,
        required: true
    },
    energy_rate: {
        type: Number,
        required: true
    },
    batch_count: {
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
