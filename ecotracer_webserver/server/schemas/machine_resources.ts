import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const MachineResourcesDataSchema = new Schema({
    volume_data: {
        type: [{
            ingredient_name: String,
            max_volume: Number,
            current_volume: Number
        }],
        default: {}
    },
    max_bottle_count: {
        type: Number,
        required: true
    },
    bottle_count: {
        type: Number,
        required: true
    }
}, {
    collection: "machine_resources"
});

module.exports = mongoose.model('MachineResourcesData', MachineResourcesDataSchema);
