import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const MachineStatsSchema = new Schema({
    timestamp: {
        type: Date,
        default: Date.now()
    },
    current: {
        type: Number,
        required: true
    },
    voltage: {
        type: Number,
        required: true
    },
    energy_rate: {
        type: Number,
        required: true
    },
    has_batch_started: {
        type: Boolean,
        required: true
    },
    status: {
        type: String,
        required: true
    }
}, {
    collection: "machine_stats"
});

module.exports = mongoose.model('MachineStats', MachineStatsSchema);
