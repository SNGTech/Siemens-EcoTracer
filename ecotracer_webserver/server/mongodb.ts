require("dotenv").config();
import mongoose from 'mongoose';

async function connectMongoDB() {
    try {
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Connected to Database at host: ${conn.connection.host}`);
    } catch(error) {
        console.log(error);
    } 
}

export { connectMongoDB };
  
