const mongoose = require("mongoose")

mongoose.set('strictQuery', true);
mongoose.connect(process.env.URL, {useNewUrlParser : true})
const connection = mongoose.connection.once("open",()=>{
    console.log("Database is Connect Successfully");
})