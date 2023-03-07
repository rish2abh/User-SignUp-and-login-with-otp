const nodemailer = require("nodemailer");

const sendMail = (otp) => {
  console.log(otp);
  let transporter = nodemailer.createTransport({
    service: "outlook",
    auth: {
      user: "rishabhshri20@outlook.com",
      pass: process.env.myPassword,
    },
  });
  var mailOptions = {
    from: "rishabhshri20@outlook.com",
    to: "rishabh.shrivastava@moreyeahs.in",
  
    html: `<h1>To verify your email this is the otp : ${otp}</h1>
          <h3>The otp will epires in 1hr</h3>`
          // <a href = ${link}>Click here to reset otp </a>`,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(1);
    } else {
      console.log(0);
    }
  });
};
module.exports = sendMail;
