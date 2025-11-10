// const nodemailer=require("nodemailer")
// require("dotenv").config()

// const transport=nodemailer.createTransport({
//     service:"gmail",
//     auth:{
//       user:process.env.EMAIL_USER,
//       pass:process.env.EMAIL_PASS
//     },
//     tls:{
//       rejectUnauthorized:false
//     }
//   })

//   module.exports=transport


const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls:{
      rejectUnauthorized:false
    }
});

module.exports = transport;


// import nodemailer from "nodemailer";

// export const transport = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   service:"gmail",
//   secure: true,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
//   tls:{
//       rejectUnauthorized:false
//     }
// });

//   module.exports=transport

