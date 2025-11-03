import mongoose  from "mongoose";
import { MONGO_URI } from "../config/config";


export const connectToDb = async ()=>{
    try{
        await mongoose.connect(MONGO_URI) 
        console.log("Database connected successfully");  
    }
    catch(e){
        console.log("Unable to connect to database", e);
        process.exit(1);  
    }
}