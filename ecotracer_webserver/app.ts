import { connectAndSubscribe } from "./server/mqtt_subscriber";
import { getData } from "./server/mqtt_subscriber";
import { connectMongoDB } from "./server/mongodb";

connectAndSubscribe();
connectMongoDB();

// ENABLE DEBUGGING DISPLAY DATA
setInterval(() => console.log(`Received data: ${getData()}`), 1000);

