import express from 'express'
import cookieparser from "cookie-parser"
import cors from 'cors'
import userRoute from "./Routes/User.routes.js"

const app = express()

app.use(cors({
  origin:process.env.CORS_ORIGIN,
  credentials:true
}))

app.use(express.json({limit:"16kb"}))

app.use(express.urlencoded({
  extended:true,
  limit:"16kb"
}))

app.use(cookieparser());

app.use("/chatApp/api/v1/user", userRoute)

export {app};