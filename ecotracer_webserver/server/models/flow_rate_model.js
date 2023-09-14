var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const FlowRates = require('../schemas/flow_rates');
function updateFlowRates(batch_payload, recipe_payload) {
    return __awaiter(this, void 0, void 0, function* () {
        let amounts_used = [];
        let required_volumes = [];
        try {
            batch_payload[batch_payload.length - 1]["consumption"];
        }
        catch (error) {
            console.log(error);
        }
    });
}
