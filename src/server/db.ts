import mongoose from "mongoose";

const connection: { isConnected?: number} = {};

async function dbConnect() {
    
    if (connection.isConnected) {
        console.log("connected");
        return;
    }

    const db = await mongoose.connect(process.env.MONGO_URI!);
    connection.isConnected = db.connections[0].readyState;
}

export default dbConnect;
