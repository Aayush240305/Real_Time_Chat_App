import dotenv from "dotenv"
import connectDB from "./Database/Index.js"
import {app} from "./App.js"

dotenv.config('./.env')

const port = process.env.PORT || 8000

connectDB()
.then(()=>{
  app.listen(port, ()=>{
    console.log(`Server is running at port : ${port}`)
  })
})
.catch((err)=>{
  console.log("Mongo db connection failed", err);
})
