require("dotenv").config()
const express = require("express")
const razorpay = require("razorpay")
const bodyParser = require("body-parser")
const expressLayouts = require("express-ejs-layouts")
const router  = require("./router/userRouter")
const razorpayRouter = require("./router/razorpayRouter")
const config  = require("./model/config")
const figlet = require("./decoration")


const app = express()
app.use(bodyParser.urlencoded({extended : true}))
app.use(expressLayouts)
app.set('view engine', 'ejs')
app.use("/checkout",razorpayRouter)
app.use("/",router)
app.use(bodyParser.json())


app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port no : ${process.env.PORT}`);
})