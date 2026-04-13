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
        mongoose.connect(process.env.MDB_URI as string);
        const connection = mongoose.connection;
        connection.on("connected", () => {
            console.log("Connected successfully");
        });
    } catch (error) {
        console.log("Connection error! Something went wrong");
        console.log(error);
    }

    // if (global.mongooseConn.conn) {
    //     return global.mongooseConn.conn;
    // }

    // if (!global.mongooseConn.promise) {
    //     global.mongooseConn.promise = mongoose.connect(
    //       process.env.MDB_URI as string,
    //         {
    //             bufferCommands: false,
    //         }
    //     );
    // }

    // global.mongooseConn.conn = await global.mongooseConn.promise;
    // console.log("✅ Mongo connected (cached)");

    // return global.mongooseConn.conn;
};

export default connectDB;

// export function ConnectMongoDb() {
//   try {
//     mongoose.connect(process.env.MDB_URI as string);
//     const connection = mongoose.connection;
//     connection.on("connected", () => {
//       console.log("Connected successfully");
//     });
//   } catch (error) {
//     console.log("Connection error! Something went wrong");
//     console.log(error);
//   }
// }