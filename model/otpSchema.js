const mongoose = require("mongoose")

const otpSave = new mongoose.Schema({
    otp : ({
        type : Number,
        required : true
    }),
    email : ({
        type : String
    }),  
    expiresAt : { 
                    type : Date,
                    expires : "1hr",
                    default : Date.now
                }
  

})

otpSave.index({ expires: 60 });
// otpSave.set("timestamps",true)
module.exports = mongoose.model("otp",otpSave)