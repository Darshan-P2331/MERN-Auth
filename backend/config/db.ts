import mongoose from "mongoose";

const connectDB =async () => {
    try {
        const conn = await mongoose.connect(`${process.env.MONGO_URI}`)
        console.log(`Mongo DB connected: ${conn.connection.host}`)
    } catch (err: any) {
        console.error(`Error: ${err.message}`);
        process.exit(1)
    }
}

export default connectDB