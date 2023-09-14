var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const BatchDataSchema = require('../schemas/batch_data');
const batchStatus = {
    COMPLETED: 0,
    ONGOING: 1
};
function updateBatchData(flow_rate, has_batch_started) {
    return __awaiter(this, void 0, void 0, function* () {
        if (has_batch_started) {
        }
    });
}
function getBatchStatus(has_batch_started, current_item_count, max_item_count) {
    if (has_batch_started) {
        return current_item_count >= max_item_count ? batchStatus.COMPLETED : batchStatus.ONGOING;
    }
    return batchStatus.COMPLETED;
}
