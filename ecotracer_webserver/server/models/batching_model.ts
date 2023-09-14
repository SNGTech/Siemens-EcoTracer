const BatchDataSchema = require('../schemas/batch_data');

const batchStatus = {
    COMPLETED: 0,
    ONGOING: 1
}

async function updateBatchData(flow_rate, has_batch_started) {
    
    if(has_batch_started) {
        
    }
}

function getBatchStatus(has_batch_started, current_item_count, max_item_count) {
    if(has_batch_started) {
        return current_item_count >= max_item_count ? batchStatus.COMPLETED : batchStatus.ONGOING;
    }
    return batchStatus.COMPLETED;
}