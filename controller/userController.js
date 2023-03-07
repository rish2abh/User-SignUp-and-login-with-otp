const user = require("../model/userSchema");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const mailsend = require("../service/sendMail");
const saveOtp = require("../model/otpSchema");
const cloudinary = require("../middleware/cloudinaryUpload")


const signUp = async (req, res) => {
  const { email, password } = req.body;
  const userData = new user(req.body);
  // console.log(req.file)
  try {
    const userExits = await user.findOne({ email: req.body.email });
    if (userExits) {
      res.status(400).json({
        status: "failed",
        message: "Email Already Exist",
      });
    } else {
      userData.password = crypto.createHmac("sha256", password).digest("hex");
      const token = jwt.sign({ userId: userData._id }, process.env.SCERET_KEY, {
        expiresIn: "1h",
      });
      // const filePath = `/uploads/${req.file.filename}`;
      // userData.profile_pic = filePath;
      
    const cloudanydata= await cloudinary.uploader.upload(req.file.path)
    userData.profile_pic =cloudanydata.url
    console.log(cloudanydata,"cloudanydata")

      const data = await userData.save();
      const otpdata = await new saveOtp();
      if (!data) {
        console.log("nhi ho payega");
      } else {
        otpdata.email = data.email;
        otpdata.otp = Math.floor(1000 + Math.random() * 9000);
        const mail = mailsend(otpdata.otp);
        const random = await otpdata.save();
        res.status(201).json({
          status: "Sucess",
          message: "Data save Sucessfully",
          email: "Check Your Email For Otp Verification",
          token: token,
          data: data,
        });
      }
    }
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: err.message,
    });
  }
};

const verifyUser = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const isEmail = await user.findOne({ email: email });
    if (isEmail != null) {
      const isOtp = await saveOtp.findOne({ otp: otp, email: email });
      if (isOtp != null) {
        const delOtp = await saveOtp.deleteMany({ email });
        const userfy = await user.findOneAndUpdate(
          { email },
          {
            $set: {
              isVerify: true,
            },
          },
          { new: true }
        );
        const data = await userfy.save();
        res.status(200).json({
          status: "sucess",
          message: "The user verify Succefully",
          data: data,
        });
      } else {
        res.json({
          status: "Failed",
          message: "Otp is incorrect,Try again",
        });
      }
    } else {
      res.json({
        status: "Failed",
        message: "Email is incorrect",
      });
    }
  } catch (error) {
    res.json({
      status: "Failed",
      message: error.message,
    });
  }
};

const resendOtp = async (req, res) => {
  const email = req.body.email;
  try {
    const matchEmail = await saveOtp.findOne({ email: email });
    if (matchEmail != null) {
      matchEmail.otp = Math.floor(1000 + Math.random() * 9000);
      console.log(matchEmail.otp);

      const update = await saveOtp.deleteOne(matchEmail);
      const mail = mailsend(matchEmail.otp);
      const data = matchEmail.save();

      res.json({
        status: "Success ",
        message: "The otp update ",
        data: update,
      });
    } else {
      res.json({
        status: "failed ",
        message: "The otp can't be change  ",
      });
    }
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email && password) {
      const valUser = await user.findOne({ email: email });
      if (valUser != null) {
        const userfy = valUser.isVerify;
        console.log(userfy);
        if (valUser.isVerify == true) {
          let data = crypto.createHmac("sha256", password).digest("hex");
          if (data === valUser.password) {
            const token = jwt.sign(
              { userId: valUser._id },
              process.env.SCERET_KEY,
              { expiresIn: "1h" }
            );
            res.status(200).json({
              status: 200,
              message: "Login Successfully",
              data: data,
              token: token,
            });
          }
        } else {
          res.status(400).json({
            status: "Failed",
            message: "User is not verifyed",
          });
        }
      } else {
        res.status(404).json({
          status: "Failed",
          message: " Password is not Valid",
        });
      }
    }
  } catch (err) {
    res.send({
      status: 400,
      message: err.message,
    });
  }
};

const sendUserResetPasswordEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const userEmail = await saveOtp.findOne({ email: email });
    if (userEmail != null) {
      userEmail.otp = Math.floor(1000 + Math.random() * 9000);
      console.log(userEmail.otp);

      // const update = await saveOtp.deleteOne(matchEmail)
      const mail = mailsend(userEmail.otp);
      const data = userEmail.save();

      res.json({
        status: "Success ",
        message: "The Otp is send to reset the password ",
        data: data,
      });
    } else {
      res.status(404).json({
        status: "failed ",
        message: "Incorrect Email",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const userPasswordReset = async (req, res) => {
  const { email, otp } = req.body;
  const { password, confirm_password } = req.body;

  try {
    const userExits = await user.findOne({ email: email });
    if (userExits) {
      const userOtp = await saveOtp.findOne({ otp: otp });
      if (userOtp != null) {
        if (password != confirm_password) {
          res.json({
            status: 401,
            message: "Password and confirm password Should be Same",
          });
        } else {
          const new_password = crypto
            .createHmac("sha256", password)
            .digest("hex");

          const data = await user.findOneAndUpdate(
            userExits,
            {
              $set: { password: new_password },
            },
            { new: true }
          );
          const data1 = data.save();
          res.status(201).json({
            success: "Success",
            message: "Password Reset Succesfully",
            data: data1,
          });
        }
      } else {
        res.status(404).json({
          status: "Failed",
          message: "Otp not match,Try Again !",
        });
      }
    } else {
      res.status(404).json({
        status: "Failed",
        message: "User not found !",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: err.message,
    });
  }
};

const getUserData = async (req, res) => {
  const { authorization } = req.headers;
  console.log(authorization);
  try {
    if (authorization != null) {
      const tokenDecodablePart = authorization.split(" ")[1];
      const decoded = jwt.decode(tokenDecodablePart, process.env.SCERET_KEY);
      const userData = await user.findOne({ _id: decoded.userId });
      res.status(200).json({
        status: "Success",
        message: "The user data is below",
        data: userData,
      });
    } else {
      res.status(500).json({
        status: "Failed",
        message: "Token is not valid",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
};

const updateImg = async(req,res)=>{
  const {email} = req.body
  // console.log(email);
  const profile_pic = req.file
  try {
    const userExits = await user.findOne({email : email})
    console.log(userExits);
    if(userExits){
    const split = userExits.profile_pic.split("/")[7]
    const splitData = split.split(".")[0]
    console.log(splitData,"spliteDAta");//amrfdezwingvqzu5rlmf.jpg
    const update = await cloudinary.uploader.upload(req.file.path,{public_id : `${splitData}`})
    console.log(update)
    const updateDp = update.url
    console.log(updateDp,"jfj");
   const result = await user.findOneAndUpdate(
    { email },
    {
      $set: {
        profile_pic: updateDp,
      },
    },
    { new: true }
  );
  console.log(result);
   res.status(200).json({
      status : "Success",
      message : "Profile pic Updated Succefully",
   })
    }else {
      res.json({
        status : 404,
        message : "Invalid Email"
      })
    }
  } catch (error) {
    res.json({
      status : 500,
      message : error.message
    })
  }
}

module.exports = {
  signUp,
  verifyUser,
  resendOtp,
  login,
  sendUserResetPasswordEmail,
  userPasswordReset,
  getUserData,
  updateImg
};
