const express = require('express');
const Razorpay = require("razorpay")
const router  = express()
const controller = require("../controller/userController")
const val = require("../Validation/userVal")
const auth = require("../middleware/auth")
const upload = require("../middleware/imageStorage")

router.post("/signup",upload.single("profile_pic"),val.userVal,controller.signUp)
router.post("/verify",controller.verifyUser)
router.post("/reset",controller.resendOtp)
router.post("/login",controller.login)
router.post("/senduser",controller.sendUserResetPasswordEmail)
router.post("/resetpassword",controller.userPasswordReset)
router.get("/getdata",auth,controller.getUserData)
router.patch("/updateimg",upload.single("profile_pic"),controller.updateImg)




module.exports = router