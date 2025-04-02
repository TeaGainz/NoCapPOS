import mongoose from "mongoose";

export const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected: ${mongoose.connection.host}');
    } catch (error){
        console.error(`Error: ${error.message}`);
        process.exit(1); // 1 = exit w/ Fail, 0 = Success
    }
}