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
exports.updateMachineStats = exports.getMachineStatsData = void 0;
const MachineStats = require('../schemas/machine_stats');
const Status = {
    Downtime: 0,
    Idle: 1,
    Work: 2
};
function getMachineStatsData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let machineStats = yield MachineStats.find();
            return machineStats[machineStats.length - 1];
        }
        catch (error) {
            console.log(error);
            return {};
        }
    });
}
exports.getMachineStatsData = getMachineStatsData;
function updateMachineStats(payload, _has_batch_started, req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let current = payload["currentRMS"];
            let voltage = payload["supplyVoltage"];
            console.log(voltage);
            let energy_rate = getPower(current, voltage);
            let has_batch_started = _has_batch_started;
            let status = getStatus(voltage, has_batch_started);
            let data = {
                current: current,
                voltage: voltage,
                energy_rate: energy_rate,
                has_batch_started: has_batch_started,
                status: status
            };
            MachineStats.insertMany([data]);
            return data;
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.updateMachineStats = updateMachineStats;
function getPower(current, voltage) {
    return (current * voltage) / 1000;
}
function getStatus(voltage, has_batch_started) {
    if (voltage < 200)
        return Status.Downtime;
    else if (!has_batch_started)
        return Status.Idle;
    else
        return Status.Work;
}
