import mongoose from "mongoose"
import {DB_Name} from "../Constant.js"

const connectDB = async()=>{
try{
  const connect = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_Name}`)
  console.log(`\n MongoDB Connected Successfully DB Host:${connect.connection.host}`)
}catch(error){
  console.log("mongodb connection error", error)
  process.exit(1)
  }
}

export default connectDB;



