const nodemailer=require("nodemailer")
require("dotenv").config()

const transport=nodemailer.createTransport({
    service:"gmail",
    auth:{
      user:process.env.EMAIL_USER,
      pass:process.env.EMAIL_PASS
    },
    tls:{
      rejectUnauthorized:false
    }
  })

  module.exports=transport