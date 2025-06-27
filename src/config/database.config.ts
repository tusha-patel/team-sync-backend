import mongoose from "mongoose"
import { config } from "./app.config"



// connectDatabase function to connect to MongoDB
const connectDatabase = async () => {
    try {
        await mongoose.connect(config.MONGO_URL);
        console.log("connected to mongo database");
    } catch (error) {
        console.error("Error connecting to mongo database", error);
        process.exit(1); 
    }
};


export default connectDatabase;