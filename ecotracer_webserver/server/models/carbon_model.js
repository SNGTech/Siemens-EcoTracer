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
exports.updateCarbonData = exports.getCarbonDataHourly = void 0;
const CarbonData = require("../schemas/carbon_data");
// TODO: FIX
function updateCarbonData(stats_payload) {
    let carbon_rate = stats_payload["energy_rate"] * 0.4057 * 1000;
    CarbonData.insertMany([
        {
            carbon_target: 23.06,
            carbon_rate: carbon_rate
        }
    ]);
    CarbonData.aggregate([
        { "$match": {
                "created_on": {
                    $gt: new Date().setUTCHours(0, 0, 0, 0),
                    $lt: new Date().setUTCHours(23, 59, 59, 999)
                }
            } },
        { "$group": { _id: { $hour: "$created_on" }, count: { $sum: 1 } } }
    ]);
}
exports.updateCarbonData = updateCarbonData;
function getCarbonDataHourly() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let data = yield CarbonData.find();
            return data;
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.getCarbonDataHourly = getCarbonDataHourly;
