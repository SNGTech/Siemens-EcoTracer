const MachineResouces = require('../schemas/machine_resources');

// IN FUTURE TO STORE AND QUERY IN A DEDICATED COLLECTION
var ingredient_names = [ 'water', 'milk', 'tea' ];
var max_volumes = [2000, 1000, 2204];
var max_bottle_count = 2304;

function resetModel() {
    let resources_arr = ingredient_names.map((name, i) => {
        return {
            ingredient_name: name,
            max_volume: max_volumes[i],
            current_volume: max_volumes[i]
        };         
    });

    MachineResouces.insertMany([
        {
            volume_data: resources_arr,
            max_bottle_count: max_bottle_count,
            bottle_count: 2304
        }
    ]);
}

async function updateResources(flow_rates: Array<number>, has_finished_item: boolean) {
    let new_ingredient_names = [];
    let new_max_volumes = [];
    let new_current_volumes = [];
    let new_max_bottle_count = 0;
    let new_bottle_count = 0;

    try {
        let resourcesData = await MachineResouces.find();
        
        ingredient_names.forEach(async (name, i) => {
            new_ingredient_names.push(name); 

            new_max_volumes.push(max_volumes[i]);

            let prev_current_volume = resourcesData.length > 1 
            ? 
            resourcesData[resourcesData.length - 1]["volume_data"][i]["current_volume"] : max_volumes[i];

            new_current_volumes.push(prev_current_volume - (flow_rates[i] / 60));
        });

        new_max_bottle_count = max_bottle_count;

        let prev_bottle_count = resourcesData.length > 1 
        ? 
        resourcesData[resourcesData.length - 1]["bottle_count"] : max_bottle_count;

        new_bottle_count = has_finished_item ? prev_bottle_count - 1 : prev_bottle_count;

        let resources_arr = new_ingredient_names.map((name, i) => {
            return {
                ingredient_name: name,
                max_volume: max_volumes[i],
                current_volume: new_current_volumes[i]
            };         
        });

        let data = {
            volume_data: resources_arr,
            max_bottle_count: new_max_bottle_count,
            bottle_count: new_bottle_count
        };

        MachineResouces.insertMany([data]);

        return data;

    } catch (error) {
        console.log(error);
        return null;
    }
}

export { resetModel, updateResources };