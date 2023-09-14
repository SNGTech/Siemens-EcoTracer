var is_on = false;
var is_valves_opened = false;
var is_batching = false;
var batch_count = false;
var current;
var voltage;
var volumes_flow_rate = [];
var valves_status = []; // false - close, true - open (meant to increment bottle usage)
var energy_rate;
var current_batch = 0;
var item_completed_flag = false;
var batch_count_json;
var selected_drink_index = 0;
