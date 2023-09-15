"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIngredientNames = exports.getResourcesData = exports.updateResources = exports.resetModel = void 0;
const MachineResouces = require('../schemas/machine_resources');
// IN FUTURE TO STORE AND QUERY IN A DEDICATED COLLECTION
var ingredient_names = ['Water', 'Tea', 'Milk'];
var max_volumes = [1, 1, 0.4];
var max_bottle_count = 40;
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
            bottle_count: max_bottle_count
        }
    ]);
}
exports.resetModel = resetModel;
function updateResources(flow_rates_payload, has_finished_item) {
    return __awaiter(this, void 0, void 0, function* () {
        let new_ingredient_names = [];
        let new_max_volumes = [];
        let new_current_volumes = [];
        let new_max_bottle_count = 0;
        let new_bottle_count = 0;
        try {
            let resourcesData = yield MachineResouces.find();
            ingredient_names.forEach((name, i) => __awaiter(this, void 0, void 0, function* () {
                new_ingredient_names.push(name);
                new_max_volumes.push(max_volumes[i]);
                let prev_current_volume = resourcesData.length > 1
                    ?
                        resourcesData[resourcesData.length - 1]["volume_data"][i]["current_volume"] : max_volumes[i];
                new_current_volumes.push(prev_current_volume - (flow_rates_payload["flow_rates"][i]["flow_rate"] / 60));
            }));
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
        }
        catch (error) {
            console.log(error);
            return null;
        }
    });
}
exports.updateResources = updateResources;
function getResourcesData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let data = yield MachineResouces.find();
            return data[data.length - 1];
        }
        catch (error) {
            console.log(error);
            return null;
        }
    });
}
exports.getResourcesData = getResourcesData;
function getIngredientNames() {
    return ingredient_names;
}
exports.getIngredientNames = getIngredientNames;
