import  mongoose  from "mongoose";
import { initCharges } from "../helpers/initCharges.js";
const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(process.env.Mongo_URL);
        console.log(`Connected To Mongodb Database ${conn.connection.host}`);
         await initCharges();
    }
    catch(error){
        console.log(`Error in Mongodb ${error}`);
    }
}

export default connectDB;