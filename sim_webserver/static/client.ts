const btn_power = document.getElementById('btn_machine_power');
const btn_water_valves = document.getElementById('btn_water_valves');
const btn_add_item = document.getElementById('btn_add_item');
const btn_remove_item = document.getElementById('btn_remove_item');
const btn_batching = document.getElementById('btn_batching');
const batch_count_field = (<HTMLInputElement>(document.getElementById('batch_count_field')));
const selected_drink_text = document.getElementById('selected_drink');
const progress_text = document.getElementById('progress_text');
const btn_black_tea = document.getElementById('black_tea');
const btn_milk = document.getElementById('milk');

function addBtnClickListener(btn: HTMLElement, endpoint: RequestInfo, preCallback: CallableFunction, postCallback: CallableFunction, postObj: Object) {
    btn.addEventListener('click', (response) => {
        preCallback();
        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postObj)
    }).then((response) => {
            if(response.ok) postCallback();
            else throw new Error("Post request failed");
        }).catch((error) => {
            console.log(error);
        });
    });
}

let machine_power_payload = { is_power_on: false };

addBtnClickListener(btn_power, '/power_toggle', 
() => {
    machine_power_payload.is_power_on = !machine_power_payload.is_power_on;
},
() => {
    if(machine_power_payload.is_power_on)
        btn_power.innerHTML = 'Power OFF Machine';
    else
        btn_power.innerHTML = 'Power ON Machine';
}, machine_power_payload);

let water_valves_payload = { is_valves_opened: false };

addBtnClickListener(btn_water_valves, '/water_valves', 
() => {
    water_valves_payload.is_valves_opened = !water_valves_payload.is_valves_opened;
},
() => {
    if(water_valves_payload.is_valves_opened)
        btn_water_valves.innerHTML = 'Close Water Valves';
    else
    btn_water_valves.innerHTML = 'Open Water Valves';
}, water_valves_payload);

function updateData() {
    fetch('/pub_data', { method: 'GET' }).then((response) => {
        if(response.ok) {
            console.log("Fetching data...");
            return response.json();
        } else throw new Error("Failed to fetch data");
    }).then((array) => {
        let data = array[array.length - 1];
        document.getElementById('machine_status').innerHTML = `Machine Status: ${data.is_on ? "ON" : "OFF"}`;
        document.getElementById('current').innerHTML = `Current: ${data.current} A`;
        document.getElementById('voltage').innerHTML = `Voltage: ${data.voltage} V`;
        document.getElementById('water_flow_rate').innerHTML = `Water Flow Rate: ${data.water_flow_rate} litres/min`;
        document.getElementById('energy_rate').innerHTML = `Energy Rate: ${data.energy_rate} kWh`;
    })
    .catch((error) => console.log(error));
}

let drink_payload = { drink_index: 0 };

addBtnClickListener(btn_black_tea, '/select_drink', 
() => {
    drink_payload.drink_index = 0;
},
() => {
    selected_drink_text.innerHTML = 'Selected Drink: Black Tea';
}, drink_payload)

addBtnClickListener(btn_milk, '/select_drink', 
() => {
    drink_payload.drink_index = 1;
},
() => {
    selected_drink_text.innerHTML = "Selected Drink: Cow's Milk";
}, drink_payload)

let batching_payload = { is_batching: false, batch_count: 0 };

addBtnClickListener(btn_batching, '/batching', 
() => {
    batching_payload.is_batching = !batching_payload.is_batching;
    batching_payload.batch_count = Number(batch_count_field.value);
},
() => {
    if(batching_payload.is_batching) {
        btn_batching.innerHTML = 'Stop Making Batch';
        progress_text.innerHTML = `Batch: 0/${batching_payload.batch_count} Items Completed`;
    }
    else {
        btn_batching.innerHTML = 'Start Making Batch';
        progress_text.innerHTML = `Batch: None Specified`;
    }
}, batching_payload)

updateData(); // Update data on intialisation

setInterval(() => {
    updateData();
}, 1000);