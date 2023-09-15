import { Request, Response } from "express";

const MachineStats = require('../schemas/machine_stats');

const Status = {
    Downtime: 0,
    Idle: 1,
    Work: 2
};

async function getMachineStatsData() {
    try {
        let machineStats = await MachineStats.find();
        return machineStats[machineStats.length - 1];
    } catch (error) {
        console.log(error);
        return {};
    }
}

function updateMachineStats(payload, _has_batch_started: boolean) {
    try {
        let current = payload["currentRMS"];
        let voltage = payload["supplyVoltage"];
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

    } catch (error) {
        console.log(error);
    }
}

function getPower(current: number, voltage: number) {
    return (current * voltage) / 1000;
}

function getStatus(voltage: number, has_batch_started: boolean) {
    if(voltage < 200)
        return Status.Downtime;
    else if(!has_batch_started)
        return Status.Idle;
    else
        return Status.Work;
}

export { getMachineStatsData, updateMachineStats };
