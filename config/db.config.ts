import dns from 'dns';
// Force use of reliable public DNS servers
dns.setServers(['1.1.1.1', '8.8.8.8']);

import mongoose from "mongoose";

declare global {
    // allow global cache in serverless
    var mongooseConn: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    };
}

global.mongooseConn ||= {
    conn: null,
    promise: null,
};

const connectDB = async () => {
    try {
        const mongouri = process.env.MDB_URI as string;
        if (!mongouri) {
            throw new Error('Please define MDB_URI environment variable');
        }

        // Return cached connection if exists
        if (global.mongooseConn.conn) {
            console.log("Using cached connection");
            return global.mongooseConn.conn;
        }

        // If no cached promise exists, create one
        if (!global.mongooseConn.promise) {
            const opts = {
                bufferCommands: false, // Disable buffering
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            };

            console.log("Establishing new database connection...");
            global.mongooseConn.promise = mongoose.connect(mongouri, opts).then((mongoose) => {
                console.log("✅ Connected successfully to MongoDB");
                return mongoose;
            });
        }

        // Wait for the connection
        global.mongooseConn.conn = await global.mongooseConn.promise;
        return global.mongooseConn.conn;

    } catch (error) {
        console.log("Connection error! Something went wrong");
        console.log(error);
        // Reset the promise on error so we can retry
        global.mongooseConn.promise = null;
        throw error;
    }
};

export default connectDB;