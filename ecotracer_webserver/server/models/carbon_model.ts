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
        {"$match":{
            "created_on" : {
                $gt: new Date().setUTCHours(0, 0, 0, 0),
                $lt: new Date().setUTCHours(23, 59, 59, 999)
            }
    
        }},
        { "$group": { _id: { $hour: "$created_on" }, count: { $sum: 1 } } }
    ]);
}

async function getCarbonDataHourly() {
    try {
        let data = await CarbonData.find();
        return data;
    } catch(error) {
        console.log(error);
    }
}

export { getCarbonDataHourly, updateCarbonData };