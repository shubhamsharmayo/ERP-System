import express from 'express'
import cors from 'cors'

import mongoose from 'mongoose'

import dotenv from 'dotenv'
import Create from '../routes/create.js'

dotenv.config()

const app = express()
const port = process.env.PORT
app.use(express.json())

app.use(cors())


mongoose.connect(process.env.DATABASE_CON).then(()=>{
    console.log("connected")
})

app.get('/',(req,res)=>{
    res.json({message:"hello"})
})

app.use("/create",Create)
app.listen(port, ()=>{
    console.log("port = " + port)
})