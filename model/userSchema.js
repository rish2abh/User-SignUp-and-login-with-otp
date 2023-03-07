const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name : ({
        type : String,
        required : true
    }),
    email : ({
        type : String,
        required : true
    }),
    password : ({
        type : String,
        required : true
    }),
    address : ({
        type : String,
        required : true
    }),
    otp: {
        type: Number,
    
      },
    isVerify : ({
        type : Boolean,
        default : false
    }),
    profile_pic : ({
        type : String,
    }),
})

userSchema.set("timestamps",true)
module.exports = mongoose.model("user",userSchema)