import  mongoose  from "mongoose";
import { initCharges } from "../helpers/initCharges.js";
const connectDB = async()=>{
      console.log("Mongo URI exists:", !!process.env.MONGO_URI);
console.log("Mongo URI:", process.env.MONGO_URI);
    try{
      
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected To Mongodb Database ${conn.connection.host}`);
         await initCharges();
    }
    catch(error){
        console.log(`Error in Mongodb ${error}`);
    }
}

export default connectDB;