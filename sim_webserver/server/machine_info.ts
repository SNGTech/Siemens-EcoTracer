import { time } from 'console';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const MachineInfoDataSchema = new Schema({
    max_water_volume: {
        type: Number,
        required: true
    },
    water_volume: {
        type: Number,
        required: true
    },
    milk_volume: {
        type: Number,
        required: true
    },
    tea_volume: {
        type: Number,
        required: true
    },
    bottle_count: {
        type: Number,
        required: true
    }
}, {
    collection: "machine_info_data"
});

module.exports = mongoose.model('MachineInfoData', MachineInfoDataSchema);
