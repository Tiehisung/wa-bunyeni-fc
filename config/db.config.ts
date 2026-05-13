import dns from 'dns';
// Force use of reliable public DNS servers
dns.setServers(['1.1.1.1', '8.8.8.8']);

import mongoose, { Connection } from "mongoose";

interface Cached {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}

// Put the cache on the Node.js global object so it
// survives across hot‑reloads in dev and across API
// route calls in serverless environments.
declare global {
  // eslint-disable-next-line no-var
  var mongoose: Cached | undefined;
}

const cached: Cached = global.mongoose ?? { conn: null, promise: null };

export default async function dbConnect(): Promise<Connection> {
  // ✅ Return existing connection if we already have one
  if (cached.conn) return cached.conn;

  // ⛔️ Fail fast if the URI isn’t configured
  if (!process.env.MDB_URI) {
    throw new Error("❌ Missing DB_URI env variable");
  }

  // 🛠 Build a single connection promise if none exists
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MDB_URI, {
        dbName: 'bunyenifc', // optional extra db name
        // Add any other options you need here
      })
      .then((m) => m.connection);
  }

  // ⌛️ Await the promise, cache the resolved connection, return it
  cached.conn = await cached.promise;
  global.mongoose = cached;

  return cached.conn;
}

// declare global {
//     // allow global cache in serverless
//     var mongooseConn: {
//         conn: typeof mongoose | null;
//         promise: Promise<typeof mongoose> | null;
//     };
// }

// global.mongooseConn ||= {
//     conn: null,
//     promise: null,
// };

// const connectDB = async () => {
//     try {
//         const mongouri = process.env.MDB_URI as string;
//         if (!mongouri) {
//             throw new Error('Please define MDB_URI environment variable');
//         }

//         // Return cached connection if exists
//         if (global.mongooseConn.conn) {
//             console.log("Using cached connection");
//             return global.mongooseConn.conn;
//         }

//         // If no cached promise exists, create one
//         if (!global.mongooseConn.promise) {
//             const opts = {
//                 bufferCommands: false, // Disable buffering
//                 serverSelectionTimeoutMS: 5000,
//                 socketTimeoutMS: 45000,
//             };

//             console.log("Establishing new database connection...");
//             global.mongooseConn.promise = mongoose.connect(mongouri, opts).then((mongoose) => {
//                 console.log("✅ Connected successfully to MongoDB");
//                 return mongoose;
//             });
//         }

//         // Wait for the connection
//         global.mongooseConn.conn = await global.mongooseConn.promise;
//         return global.mongooseConn.conn;

//     } catch (error) {
//         console.log("Connection error! Something went wrong");
//         console.log(error);
//         // Reset the promise on error so we can retry
//         global.mongooseConn.promise = null;
//         throw error;
//     }
// };

// export default connectDB;
