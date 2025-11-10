// const express=require("express")
// const cors=require("cors")
// const mysql=require("./db/mysql")
// const body_parser=require("body-parser")
// const jwt=require("jsonwebtoken")
// const cookieparser=require("cookie-parser")
// const transport=require("./mail/transporter")
// const verifyToken=require("../backend/auth/jwt")
// const {v2:cloudinary}=require("cloudinary")
// const { v4: uuid } = require("uuid")
// const streamifier=require("streamifier")
// const bcrypt=require("bcrypt")
// const multer=require("multer")
// const { Server }=require("socket.io")
// const http=require("http")
// require("dotenv").config()
// const app=express()


// cloudinary.config({
//     cloud_name:"dremmnwjv",
//     api_key:"745877682792469",
//     api_secret:"jLb525CwuE4B3eK2W8nwFBvqXVQ",
// })

// const memoryStorage=multer.memoryStorage()
// const uplod=multer({memoryStorage,limits:{fileSize: 20 * 1024 * 1024 }})



// app.use(express.json({limit:"50mb"}))
// app.use(cors(
//     {
//     origin: ["http://localhost:5173","https://sivify-frontend.onrender.com"], 
//     credentials: true 
//     }
// ))
// app.use(body_parser.urlencoded({ limit:"50mb",extended: false }));
// app.use(body_parser.json())
// app.use(cookieparser())



// //handle login process
// app.post("/login",async (req,res,next)=>{

//     const body=req.body

//     const [rows]=await mysql.execute("select * from users where email=?",[body.email])
    
//     if(rows.length>0){
//         const password=rows[0].password

//         if(await bcrypt.compare(body.password,password)){
//             const token=jwt.sign({"email":body.email,"user_id":rows[0].user_id},process.env.JSON_SECRET)
   
//             return res
//             .cookie("token",token,{
//                 httpOnly:true,
//                 secure:true,
//                 sameSite:"none",
//                 maxAge: 24 * 60 * 60 * 1000
//             })
//             .json({
//                 exists:true
//             })
//         }
//         else{
//             return res.json({
//                 exists:false
//             })
//         }
//     }
//     else{
//         return res.json({
//             exists:false
//         })
//     }
// })

// //check weather the email already exist during signup process
// app.post("/check_exist",async (req,res,next)=>{
//     const {email} = req.body

//     const [rows]=await mysql.execute("select * from users where email=?",[email])
//     if(rows.length > 0){
//         return res.json({
//             exists:true,
//             user:rows[0]
//         })
//     }
//     else{
//         return res.status(200).json({
//             exists:false,
//         })
//     }
    
// })

// //check weather the username already exist during signup process if not sent otp to the mail
// app.post("/check_username",async (req,res,next)=>{
//     const body=req.body
    
//     //check weather th username already exist
//     const [rows]=await mysql.execute("select * from users where user_id=?",[body.username])

//     if(rows.length>0){
//         //if username alredy exist then return the response as exist true
//         return res.json({
//             exists:true
//         })
//     }
//     else{
//         //if username not already exist then generate otp and store on db and sent to mail
//         const otp=Math.floor(100000 + Math.random() * 900000)
//         const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 mins expiry

//         //insert otp on db 
//         const [rows]=await mysql.execute("insert into otp values(?,?,?)",[body.email,otp,expiresAt])

//         //if error in inserting otp then return the response as otp not sent
//         if(rows.affectedRows==0){            
//             return res.json({
//                 otp_sent:false,
//                 exists:false,
//             })
//         }

//         //if otp stored on db then prepare for sending mail
//         //otp configurations for mail
//         const options={
//             from:process.env.EMAIL_USER,
//             to:body.email,
//             subject:"OTP from Sivify",
//             text:`otp for sivify signup : ${otp} , this otp is valid for 2 minites`
//         }

//         //sending mail
//         transport.sendMail(options,(err,result)=>{
//             //if error occur in sending then return the response as otp sent false
//             if(err){
//                 return res.json({
//                     otp_sent:false,
//                     exists:false,
//                 })
//             }
//             //if otp sent successfully then return the response as ote sent true
//             return res.json({
//                 otp_sent:true,
//                 exists:false
//             })
//         })
        
        
//     }
    
// })


// //verify the otp received from user
// app.post("/verify_otp",async (req,res,next)=>{
    
//     const body=req.body
//     const received_otp=body.received_otp  
    

//     //retreive the most recent otp stored on db
//     const [rows] = await mysql.execute('select otp, expired_at from otp where email=? ORDER BY expired_at DESC LIMIT 1',[body.email])
    

//     //otp not found on db
//     if(rows.length == 0){
//         res.json({
//             success:false
//         })
//     }    

//     //check weather the latest otp matches with received otp(user entered), if yes then store user data on db

//     //if matches then do the procedure for store user data on db
//     if(received_otp == rows[0].otp){
        

//         body["password"]=await bcrypt.hash(body.password,10)
        

//         //insert user data on db
//         const [rows]=await mysql.execute("insert into users(email,user_id,password) values(?,?,?)",[body.email,body.username,body.password])    
        
//         //if inserted successfully return response as success
//         if(rows.affectedRows>0){            
//             const token=jwt.sign({"email":body.email,"user_id":body.username},process.env.JSON_SECRET)            
            
//             return res
//             .cookie("token",token,{
//                 httpOnly:true,
//                 secure:true,
//                 sameSite:"none",
//                 maxAge: 24 * 60 * 60 * 1000
//             })
//             .json({
//                 success:true
//             })
//         }
//         //if not inserted then return response as false
//         else{
//             return res.json({
//                 success:false
//             })
//         }  
//     }
//     else{
        
//         //if otp not matches return response as false for invalid otp
//         return res.json({
//             success:false
//         })
    
        
//     }
    
// })


// //handle home route
// app.get("/home",verifyToken,async (req,res,next)=>{
//     res.json({
//         success:true
//     })
// })

// //handle the profile route
// app.get("/profile",verifyToken,async (req,res,next)=>{   
//     const user_id=req.user.user_id
//     const [rows]=await mysql.execute("select name,u.user_id,u.avatar_url,u.bio,(select count(*) from follows where follower_id = ?) as no_following,(select count(*) from follows where following_id = ?) as no_followers,(select count(*) from posts where user_id=?) as no_posts from users as u where u.user_id = ?",[user_id,user_id,user_id,user_id])
    
//     return res.json({
//         success:true,
//         user:rows[0]
//     })
    
// })


// //handle logout process
// app.get("/logout",(req,res,next)=>{
//     res.clearCookie("token",{
//         httpOnly:true,
//         secure:false,
//         path:"/",
//     })

//     return res.json({
//         success:true
//     })
// })





// app.post("/upload_post",verifyToken,uplod.array("post"),async (req,res,next)=>{

//     const user=req.user
//     const caption=req.body.caption
    
//     const postId = uuid()
//     let urls=[]
//     const folder_path=`users/${req.user.email}/posts/${postId}`
    
//     try{
//             for (const file of req.files) {
//                 const result = await new Promise((resolve, reject) => {
//                     const uploadStream = cloudinary.uploader.upload_stream(
//                     {
//                         resource_type: "auto",
//                         folder: folder_path,
//                     },
//                     (err, result) => {
//                         if (err) return reject(err);
//                         resolve(result);
//                     }
//                     );

//                     streamifier.createReadStream(file.buffer).pipe(uploadStream);
//                 });

//                 urls.push({
//                     secure_url: result.secure_url,
//                     public_id: result.public_id,
//                 });
//             }
        

//             const [uploadPostResult]=await mysql.execute("insert into posts(user_id,caption) values(?,?)",[user.user_id,caption])
        
//             if(uploadPostResult.affectedRows>0){
//                 const post_id=uploadPostResult.insertId

//                 for(const url of urls){
//                     await mysql.execute("insert into post_files(post_id,file_url,public_id) values(?,?,?)",[post_id,url.secure_url,url.public_id])
//                 }

//                 return res.json({
//                     success:true,
//                     message:"post uploded"
//                 })
//             }
//             else{
//                 return res.json({
//                     success:false,
//                     message:"error in uploading post"
//                 })
//             }
//         }catch(err){
//             return res.json({
//                     success:false,
//                     message:err
//             })
//     }
// })


// app.get("/search",verifyToken,async (req,res,next)=>{
//     const username=req.query.username
    
//     const [rows]=await mysql.execute(`select user_id,name,avatar_url from users where user_id like ? or name like ?`,[`${username}%`,`${username}%`])


//     if(rows.length>0){
//         return res.json({
//             "users":rows,
//             "found":true
//         })
//     }
//     else{
//         return res.json({
//             "found":false
//         })
//     }

// })



// app.post("/set_profile",verifyToken,uplod.single("profile_pic"),async (req,res,next)=>{
//     const name=req.body.name
//     const bio=req.body.bio

//     console.log(req.body);
    
//     const profile_pic=req.file
    
//     try{
        
//         const result=await new Promise((resolve,reject)=>{
//             const upload_stream=cloudinary.uploader.upload_stream(
//                 {
//                     resource_type:"auto",
//                     folder:`/users/${req.user.email}/profile_picture/${profile_pic.originalname}`
//                 },
//                 (err,result)=>{                    
//                     if(err)return reject(err)
//                     resolve(result)
//                 }
//             )

//             streamifier.createReadStream(profile_pic.buffer).pipe(upload_stream)
//         })

//         const {secure_url,public_id}=result        

//         const [setProfile]=await mysql.execute("update users set name=?,avatar_url=?,avatar_public_id=?,bio=? where email=?",[name,secure_url,public_id,bio,req.user.email])
//         if(setProfile.affectedRows>0){
//             return res.json({
//                 "success":true
//             })
//         }
//         else{
            
//             return res.json({
//                 "success":false
//             })
//         }
//     }
//     catch(err){
//         return res.json({
//                 "success":false
//         })
//     }
       
// })

// app.get("/fetch_user_details",verifyToken,async (req,res,next)=>{
//     const [rows]=await mysql.execute("select user_id,name,avatar_url,avatar_public_id,bio from users where email=?",[req.user.email])

//     return res.json(rows[0])
    
// })

// app.post("/check_username_exist",verifyToken,async (req,res,next)=>{
//     const {user_id}=req.body
//     const email = req.user.email
    
//     const [rows]=await mysql.execute("select name from users where user_id=? and email!=?",[user_id,email])

//     if(rows.length > 0){

//         return res.json({
//             exists:true,
//         })
//     }
//     else{
//         return res.status(200).json({
//             exists:false,
//         })
//     }
    
// })

// app.post("/edit_profile",verifyToken,uplod.single("profile_pic"),async (req,res,next)=>{
//     const profile_pic=req.file    
    
//     try{
//         if(profile_pic){
//             const public_id=req.body.public_id

//             const result=await new Promise((resolve,reject)=>{
//                 const upload_stream=cloudinary.uploader.upload_stream(
//                     {resource_type:"auto",public_id:public_id,overwrite:true},
//                     (err,result)=>{
//                         if(err)return reject(err)
//                             resolve(result)
//                     }
//                 )
//                 streamifier.createReadStream(profile_pic.buffer).pipe(upload_stream)
//             })
            
//             const updated_secure_url=result.secure_url
//             const updated_public_id=result.public_id

//             const updated_name=req.body.name
//             const updated_bio=req.body.bio


//             const [rows]=await mysql.execute("update users set name=?,avatar_url=?,avatar_public_id=?,bio=? where email=?",[updated_name,updated_secure_url,updated_public_id,updated_bio,req.user.email])
//             if(rows.affectedRows>0){
//                 return res.json({
//                     success:true
//                 })
//             }
//             return res.json({
//                     success:false
//             })  

//         }
//         else{
//             const updated_name=req.body.name
//             const updated_bio=req.body.bio

//             const [rows]=await mysql.execute("update users set name=?,bio=? where email=?",[updated_name,updated_bio,req.user.email])
//             if(rows.affectedRows>0){
//                 return res.json({
//                     success:true
//                 })
//             } 
//             else{
//                 return res.json({
//                     success:false
//                 })
//             }
//         }
//     }
//     catch(err){
//         console.log(err);
    
//     }

// })

// app.get("/current_user",verifyToken,(req,res,next)=>{
//     return res.json(req.user)
// })


// app.get("/fetch_single_user_profile/:user_id",verifyToken,async (req,res,next)=>{
    
//     const user_id=req.params.user_id

//     const [rows]=await mysql.execute("select name,u.user_id,u.avatar_url,u.bio,(select count(*) from follows where follower_id = ?) as no_following,(select count(*) from follows where following_id = ?) as no_followers,(select count(*) from posts where user_id=?) as no_posts from users as u where u.user_id = ?",[user_id,user_id,user_id,user_id])
    
//     if(rows.length>0){
//         return res.json(rows[0])
//     }
    
// })

// app.post("/follow",verifyToken,async(req,res,next)=>{
//     const follower_id=req.user.user_id
//     const following_id=req.body.following_id

//     const [rows]=await mysql.execute("insert into follows(follower_id,following_id) values(?,?)",[follower_id,following_id])
//     if(rows.affectedRows>0){
//         const [result]=await mysql.execute("select avatar_url from users where user_id=?",[follower_id])
//         const [rows]=await mysql.execute("insert into notifications(from_id,to_id,from_profile_pic,message) values(?,?,?,?)",[follower_id,following_id,result[0].avatar_url,`${follower_id} started following you`])
        
//         if(rows.affectedRows>0){
//             const following_sock=users.get(following_id)
//             if (following_sock) {
//                 io.to(following_sock).emit("follow_request", {
//                     from_id: follower_id,
//                     from_profile_pic: result[0].avatar_url,
//                     message: `${follower_id} started following you`,
//                     created_at: new Date()
//             });
// }

//         }    
//         return res.json({
//             success:true
//         })
//     }    
// })

// app.post("/unfollow",verifyToken,async(req,res,next)=>{
//     const follower_id=req.user.user_id
//     const following_id=req.body.following_id

//     const [rows]=await mysql.execute("delete from follows where follower_id=? and following_id=?",[follower_id,following_id])

//     return res.json({
//         success:true
//     })
    
// })


// app.post("/is_follower",verifyToken,async (req,res,next)=>{
//     const follower_id=req.user.user_id
//     const following_id=req.body.following_id

//     const [rows]=await mysql.execute("select * from follows where follower_id=? and following_id=?",[follower_id,following_id])

//     if(rows.length>0){
//         return res.json({
//             is_follower:true
//         })
//     }
//     else{
//         return res.json({
//             is_follower:false
//         })
//     }
// })


// app.get("/fetch_following",verifyToken,async(req,res,next)=>{
//     const user_id=req.user.user_id

//     const [rows] = await mysql.execute(
//     `SELECT f.following_id, u.avatar_url 
//     FROM follows f 
//     JOIN users u ON f.following_id = u.user_id 
//     WHERE f.follower_id = ?`,
//     [user_id]
//     );
    


//     res.json({
//         "data":rows,
//         "user_id":user_id
//     })

// })


// app.get("/fetch_notifications",verifyToken,async (req,res,next)=>{
//     const [rows]=await mysql.execute("select * from notifications where to_id=? order by created_at",[req.user.user_id])    
//     res.json({
//         notifications:rows
//     })
// })

// app.get("/fetch_posts",verifyToken,async(req,res,next)=>{
//     const [rows] = await mysql.execute(`
//   SELECT 
//   posts.user_id,
//   posts.caption,
//   posts.created_at,
//   posts.post_id,
//   ANY_VALUE(users.avatar_url) AS avatar_url,
//   GROUP_CONCAT(post_files.file_url) AS file_urls
// FROM posts
// JOIN post_files ON posts.post_id = post_files.post_id
// JOIN users ON users.user_id = posts.user_id
// GROUP BY posts.post_id
// ORDER BY posts.created_at DESC;
// `,[req.user.user_id]);

//         rows.forEach((row)=>{
//             row.file_urls=row.file_urls.split(",")
//         })

//     return res.json({
//         "posts":rows
//     })
    
// })


// app.post("/like", verifyToken, async (req, res) => {
    
//   const { post_id, unlike,user_id } = req.body;
//   const liked_user_id = req.user.user_id;

//   try {
//     if (unlike) {        
//       await mysql.execute("DELETE FROM likes WHERE post_id=? AND user_id=?", [post_id, liked_user_id]);
      
//     }
//     else {
//       await mysql.execute("INSERT INTO likes (post_id, user_id) VALUES (?, ?)", [post_id, liked_user_id]);
//       const [result]=await mysql.execute("select avatar_url from users where user_id=?",[liked_user_id])
//       const [rows]=await mysql.execute("insert into notifications(from_id,to_id,from_profile_pic,post_id,message) values(?,?,?,?,?)",[liked_user_id,user_id,result[0].avatar_url,post_id,`${liked_user_id} liked your post`])
      
//       const dest_sock=users.get(user_id)
//       if(dest_sock){
//         io.to(dest_sock).emit("like_notify",{
//             from:liked_user_id,
//             message:`${liked_user_id} likes your post`,
//             from_profile_pic:result[0].avatar_url,
//             post_id:post_id,
//             created_at:new Date()
//         })
//       }
//     }

//     return res.json({ success: true });
//   } catch (err) {
//     return res.json({ success: false, error: err.message });
//   }
// });


// app.get("/fetch_likes",verifyToken,async(req,res,next)=>{
//     const [rows]=await mysql.execute("select * from likes where user_id=?",[req.user.user_id])

//     const liked=[]

//     rows.forEach((row)=>{
//         liked.push(row.post_id)
//     })
        
//     return res.json({
//         "liked_posts":liked
//     })
    
// })

// app.get("/fetch_own_posts",verifyToken,async(req,res,next)=>{
//     const [rows] = await mysql.execute(`
//   SELECT 
//     posts.user_id,
//     posts.caption,
//     posts.created_at,
//     posts.post_id,
//     users.avatar_url,
//     GROUP_CONCAT(post_files.file_url) AS file_urls
//   FROM posts
//   JOIN post_files ON posts.post_id = post_files.post_id
//   JOIN users ON users.user_id = posts.user_id
//   GROUP BY posts.post_id
// `);


//         rows.forEach((row)=>{
//             row.file_urls=row.file_urls.split(",")
//         })

//     return res.json({
//         "posts":rows
//     })
    
// })

// app.use("/fetch_own_user_posts",verifyToken,async(req,res,next)=>{

//     const [rows]=await mysql.execute(`
//   SELECT 
//     posts.user_id,
//     posts.caption,
//     posts.created_at,
//     posts.post_id,
//     users.avatar_url,
//     GROUP_CONCAT(post_files.file_url) AS file_urls
//   FROM posts
//   JOIN post_files ON posts.post_id = post_files.post_id
//   JOIN users ON users.user_id = posts.user_id
//   where users.user_id=?
//   GROUP BY posts.post_id`,[req.user.user_id])

//     rows.forEach((row)=>{
//         row.file_urls=row.file_urls.split(',')
//     })
    
//     return res.json({
//         rows
//     })
    
// })


// app.use("/fetch_single_user_posts/:user_id",verifyToken,async(req,res,next)=>{

//     const {user_id}=req.params
//     console.log(user_id);
    
    
    

//     const [rows]=await mysql.execute(`
//   SELECT 
//     posts.user_id,
//     posts.caption,
//     posts.created_at,
//     posts.post_id,
//     users.avatar_url,
//     GROUP_CONCAT(post_files.file_url) AS file_urls
//   FROM posts
//   JOIN post_files ON posts.post_id = post_files.post_id
//   JOIN users ON users.user_id = posts.user_id
//   where users.user_id=?
//   GROUP BY posts.post_id`,[user_id])

//     rows.forEach((row)=>{
//         row.file_urls=row.file_urls.split(',')
//     })
    
    
//     return res.json({
//         rows
//     })
    
// })

// app.get("/fetch_messages/:rec_user_id",verifyToken,async(req,res,next)=>{

//     const {rec_user_id}=req.params    
    
//     const [rows]=await mysql.execute("select sender,receiver,message from messages where sender=? and receiver=? or sender=? and receiver=? order by time",[req.user.user_id,rec_user_id,rec_user_id,req.user.user_id])
    
//     return res.json({
//         rows
//     })
      
// })

// app.post("/delete_post/:post_id",verifyToken,async(req,res,next)=>{
//     const {post_id}=req.params

//     const [rows]=await mysql.execute("delete from posts where post_id=?",[post_id])

//     if(rows.affectedRows>0){
//         return res.json({
//             success:true
//         })
//     }
    
// })



// app.get("/fetch_msg_req",verifyToken,async(req,res,next)=>{
//     const [rows]=await mysql.execute("select distinct m.sender as following_id,u.avatar_url from messages m join users u on u.user_id=m.sender where receiver=?",[req.user.user_id])

//     console.log(rows);

//     return res.json({
//         rows
//     })
    
// })











// const server=http.createServer(app)

// const io=new Server(server,{
//     cors:{
//         origin:"*",
//         methods:["GET","POST"]
//     }
// })

// const users=new Map()

// io.on("connection",(sock)=>{

//     sock.on("register",(userid)=>{
//         users.set(userid,sock.id)
//     })

//     sock.on("sent_message",async (data)=>{
//         console.log(data);
        
//         const {sender,receiver,message}=data
                
//         const [rows]=await mysql.execute("insert into messages(sender,receiver,message) values(?,?,?)",[sender,receiver,message])
        
//         if(rows.affectedRows>0){            
//             const dest=users.get(receiver)
//             if(dest){
//                 io.to(dest).emit("receive",{"sender":sender,"receiver":receiver,"message":message})
//             }
//         }
//     })
// })





// server.listen(process.env.PORT,()=>{
//     console.log("Server Running Successfully");
// })

































































// server.js
const express = require("express");
const cors = require("cors");
// removed mysql import and replaced with supabase client
const supabase = require("./db/supabase");
const body_parser = require("body-parser");
const jwt = require("jsonwebtoken");
const cookieparser = require("cookie-parser");
const transport = require("./mail/transporter");
const verifyToken = require("../backend/auth/jwt");
const { v2: cloudinary } = require("cloudinary");
const { v4: uuid } = require("uuid");
const streamifier = require("streamifier");
const bcrypt = require("bcrypt");
const multer = require("multer");
const { Server } = require("socket.io");
const http = require("http");
require("dotenv").config();
const app = express();

cloudinary.config({
  cloud_name: "dremmnwjv",
  api_key: "745877682792469",
  api_secret: "jLb525CwuE4B3eK2W8nwFBvqXVQ",
});

const memoryStorage = multer.memoryStorage();
const uplod = multer({ memoryStorage, limits: { fileSize: 20 * 1024 * 1024 } });

app.use(express.json({ limit: "50mb" }));
app.use(cors({
  origin: ["http://localhost:5173", "https://sivify-frontend.onrender.com"],
  credentials: true
}));
app.use(body_parser.urlencoded({ limit: "50mb", extended: false }));
app.use(body_parser.json());
app.use(cookieparser());

// --- Helper functions for counts and small operations ---
async function countRows(table, filterColumn, filterValue) {
  // returns integer count or 0
  const { count, error } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true })
    .eq(filterColumn, filterValue);

  if (error) return 0;
  return count || 0;
}

async function getUserByEmail(email) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .limit(1);

  if (error) return null;
  return (data && data.length) ? data[0] : null;
}

// -------------------- ROUTES --------------------

//handle login process
app.post("/login", async (req, res, next) => {
  const body = req.body;

  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', body.email)
      .limit(1);

    if (error) {
      return res.json({ exists: false });
    }

    if (users && users.length > 0) {
      const password = users[0].password;

      if (await bcrypt.compare(body.password, password)) {
        const token = jwt.sign({ email: body.email, user_id: users[0].user_id }, process.env.JSON_SECRET);

        return res
          .cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000
          })
          .json({
            exists: true
          });
      } else {
        return res.json({
          exists: false
        });
      }
    } else {
      return res.json({
        exists: false
      });
    }
  } catch (err) {
    return res.json({ exists: false });
  }
});

//check whether the email already exist during signup process
app.post("/check_exist", async (req, res, next) => {
  const { email } = req.body;

  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .limit(1);

  if (error) {
    return res.status(200).json({ exists: false });
  }

  if (users && users.length > 0) {
    return res.json({
      exists: true,
      user: users[0]
    });
  } else {
    return res.status(200).json({
      exists: false,
    });
  }
});

//check whether the username already exist during signup process if not sent otp to the mail
// app.post("/check_username", async (req, res, next) => {
//   const body = req.body;

//   // check whether the username already exists
//   const { data: users, error } = await supabase
//     .from('users')
//     .select('*')
//     .eq('user_id', body.username)
//     .limit(1);

//   if (error) {
//     return res.json({ exists: false });
//   }

//   if (users && users.length > 0) {
//     // if username already exists then return the response as exists true
//     return res.json({
//       exists: true
//     });
//   } else {
//     // generate otp and store on db and send mail
//     const otp = Math.floor(100000 + Math.random() * 900000);
//     const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 mins expiry

//     // insert otp on db
//     const { data: insertedOtp, error: insertErr } = await supabase
//       .from('otp')
//       .insert({ email: body.email, otp: otp, expired_at: expiresAt })
//       .select();

//     if (insertErr || !insertedOtp) {
//       return res.json({
//         otp_sent: false,
//         exists: false,
//       });
//     }

//     // sending mail
//     const options = {
//       from: process.env.EMAIL_USER,
//       to: body.email,
//       subject: "OTP from Sivify",
//       text: `otp for sivify signup : ${otp} , this otp is valid for 2 minites`
//     };

//     transport.sendMail(options, (err, result) => {
//       if (err) {
//         return res.json({
//           otp_sent: false,
//           exists: false,
//         });
//       }
//       return res.json({
//         otp_sent: true,
//         exists: false
//       });
//     });
//   }
// });

// app.post("/check_username", async (req, res) => {
//   try {
//     const { email, username, password } = req.body;

//     if (!email || !username || !password) {
//       return res.json({ exists: false, otp_sent: false, message: "Missing data" });
//     }

//     // check whether username already exists
//     const { data: users, error: userErr } = await supabase
//       .from('users')
//       .select('user_id')
//       .eq('user_id', username)
//       .limit(1);

//     if (userErr) {
//       console.log("Supabase error:", userErr);
//       return res.json({ exists: false, otp_sent: false });
//     }

//     if (users && users.length > 0) {
//       // username already taken
//       return res.json({ exists: true });
//     }

//     // generate OTP
//     const otp = Math.floor(100000 + Math.random() * 900000);
//     const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 mins expiry

//     // delete any old OTP for same email (optional cleanup)
//     await supabase.from("otp").delete().eq("email", email);

//     // insert new OTP
//     const { data: insertedOtp, error: insertErr } = await supabase
//       .from('otp')
//       .insert([{ email, otp: otp.toString(), expired_at: expiresAt }])
//       .select();

//     if (insertErr || !insertedOtp) {
//       console.log("OTP insert error:", insertErr);
//       return res.json({ exists: false, otp_sent: false });
//     }

//     // send mail
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "OTP from Sivify",
//       text: `Your OTP for Sivify signup is ${otp}. It is valid for 2 minutes.`,
//     };

//     transport.sendMail(mailOptions, (err, result) => {
//       if (err) {
//         console.log("Mail error:", err);
//         return res.json({ exists: false, otp_sent: false });
//       }

//       console.log(`OTP ${otp} sent to ${email}`);
//       return res.json({ exists: false, otp_sent: true });
//     });
//   } catch (err) {
//     console.log("Error in /check_username:", err);
//     return res.json({ exists: false, otp_sent: false });
//   }
// });

// app.post("/check_username", async (req, res) => {
//   try {
//     const { email, username, password } = req.body;

//     if (!email || !username || !password) {
//       console.log("Missing fields");
//       return res.status(400).json({ exists: false, otp_sent: false, message: "Missing data" });
//     }

//     // check username existence
//     const { data: users, error: userErr } = await supabase
//       .from("users")
//       .select("user_id")
//       .eq("user_id", username)
//       .limit(1);

//     if (userErr) {
//       console.log("Supabase select error:", userErr);
//       return res.status(500).json({ exists: false, otp_sent: false, message: "DB error" });
//     }

//     if (users && users.length > 0) {
//       console.log("Username exists");
//       return res.json({ exists: true });
//     }

//     // generate OTP
//     const otp = Math.floor(100000 + Math.random() * 900000);
//     const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

//     // delete any old OTP for same email
//     await supabase.from("otp").delete().eq("email", email);

//     // insert OTP
//     const { data: insertedOtp, error: insertErr } = await supabase
//       .from("otp")
//       .insert([{ email, otp: otp.toString(), expired_at: expiresAt }])
//       .select();

//     if (insertErr) {
//       console.log("OTP insert error:", insertErr);
//       return res.status(500).json({ exists: false, otp_sent: false, message: "OTP insert failed" });
//     }

//     // send mail
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "OTP from Sivify",
//       text: `Your OTP for Sivify signup is ${otp}. It is valid for 2 minutes.`,
//     };

//     transport.sendMail(mailOptions, (err) => {
//       if (err) {
//         console.log("Mail error:", err);
//         return res.status(500).json({ exists: false, otp_sent: false, message: "Mail failed" });
//       }

//       console.log(`OTP ${otp} sent to ${email}`);
//       return res.json({ exists: false, otp_sent: true });
//     });
//   } catch (err) {
//     console.log("Unhandled error:", err);
//     return res.status(500).json({ exists: false, otp_sent: false, message: "Server error" });
//   }
// });


app.post("/check_username", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      console.log("Missing fields");
      return res.status(400).json({ exists: false, success: false, message: "Missing data" });
    }

    // check if username already exists
    const { data: users, error: userErr } = await supabase
      .from("users")
      .select("user_id")
      .eq("user_id", username)
      .limit(1);

    if (userErr) {
      console.log("Supabase select error:", userErr);
      return res.status(500).json({ exists: false, success: false, message: "DB error" });
    }

    if (users && users.length > 0) {
      console.log("Username exists");
      return res.json({ exists: true, success: false });
    }

    // if username not exist, insert new user
    const { error: insertErr } = await supabase
      .from("users")
      .insert([{ user_id: username, email, password }]);

    if (insertErr) {
      console.log("Insert error:", insertErr);
      return res.status(500).json({ exists: false, success: false, message: "User insert failed" });
    }

    console.log(`New user ${username} created`);
    return res.json({ exists: false, success: true, message: "Signup successful" });

  } catch (err) {
    console.log("Unhandled error:", err);
    return res.status(500).json({ exists: false, success: false, message: "Server error" });
  }
});



//verify the otp received from user
app.post("/verify_otp", async (req, res, next) => {
  const body = req.body;
  const received_otp = body.received_otp;

  // retrieve the most recent otp stored on db
  const { data: otpRows, error: otpErr } = await supabase
    .from('otp')
    .select('otp, expired_at')
    .eq('email', body.email)
    .order('expired_at', { ascending: false })
    .limit(1);

  if (otpErr || !otpRows || otpRows.length === 0) {
    return res.json({ success: false });
  }

  if (received_otp == otpRows[0].otp) {
    body["password"] = await bcrypt.hash(body.password, 10);

    // insert user data on db
    const { data: insertedUsers, error: insertUserErr } = await supabase
      .from('users')
      .insert({ email: body.email, user_id: body.username, password: body.password })
      .select();

    if (insertUserErr || !insertedUsers || insertedUsers.length === 0) {
      return res.json({ success: false });
    }

    // inserted successfully
    const token = jwt.sign({ email: body.email, user_id: body.username }, process.env.JSON_SECRET);

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000
      })
      .json({
        success: true
      });
  } else {
    // invalid otp
    return res.json({ success: false });
  }
});

//handle home route
app.get("/home", verifyToken, async (req, res, next) => {
  res.json({ success: true });
});

//handle the profile route
app.get("/profile", verifyToken, async (req, res, next) => {
  try {
    const user_id = req.user.user_id;

    // get user basic info
    const { data: userRows, error: userErr } = await supabase
      .from('users')
      .select('name, user_id, avatar_url, bio')
      .eq('user_id', user_id)
      .limit(1);

    if (userErr || !userRows || userRows.length === 0) {
      return res.json({ success: true, user: null });
    }

    const userObj = userRows[0];

    // counts
    const no_following = await countRows('follows', 'follower_id', user_id);
    const no_followers = await countRows('follows', 'following_id', user_id);
    const no_posts = await countRows('posts', 'user_id', user_id);

    return res.json({
      success: true,
      user: {
        name: userObj.name,
        user_id: userObj.user_id,
        avatar_url: userObj.avatar_url,
        bio: userObj.bio,
        no_following,
        no_followers,
        no_posts
      }
    });
  } catch (err) {
    return res.json({ success: true, user: null });
  }
});

//handle logout process
app.get("/logout", (req, res, next) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    path: "/",
  });

  return res.json({
    success: true
  });
});

app.post("/upload_post", verifyToken, uplod.array("post"), async (req, res, next) => {
  const user = req.user;
  const caption = req.body.caption;

  const postId = uuid();
  let urls = [];
  const folder_path = `users/${req.user.email}/posts/${postId}`;

  try {
    for (const file of req.files) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "auto",
            folder: folder_path,
          },
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );

        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });

      urls.push({
        secure_url: result.secure_url,
        public_id: result.public_id,
      });
    }

    // insert into posts
    const { data: insertedPost, error: insertPostErr } = await supabase
      .from('posts')
      .insert({ user_id: user.user_id, caption })
      .select();

    if (insertPostErr || !insertedPost || insertedPost.length === 0) {
      return res.json({
        success: false,
        message: "error in uploading post"
      });
    }

    const post_id = insertedPost[0].post_id || insertedPost[0].id || insertedPost[0].postId;

    // insert post_files
    for (const url of urls) {
      await supabase.from('post_files').insert({
        post_id: post_id,
        file_url: url.secure_url,
        public_id: url.public_id
      });
    }

    return res.json({
      success: true,
      message: "post uploded"
    });
  } catch (err) {
    return res.json({
      success: false,
      message: err.message || err
    });
  }
});

app.get("/search", verifyToken, async (req, res, next) => {
  const username = req.query.username || '';

  const { data: rows, error } = await supabase
    .from('users')
    .select('user_id, name, avatar_url')
    .or(`user_id.ilike.${username}% , name.ilike.${username}%`);

  if (error) {
    return res.json({ found: false });
  }

  if (rows && rows.length > 0) {
    return res.json({
      users: rows,
      found: true
    });
  } else {
    return res.json({
      found: false
    });
  }
});

app.post("/set_profile", verifyToken, uplod.single("profile_pic"), async (req, res, next) => {
  const name = req.body.name;
  const bio = req.body.bio;
  const profile_pic = req.file;

  try {
    const result = await new Promise((resolve, reject) => {
      const upload_stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: `/users/${req.user.email}/profile_picture/${profile_pic.originalname}`
        },
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );

      streamifier.createReadStream(profile_pic.buffer).pipe(upload_stream);
    });

    const { secure_url, public_id } = result;

    const { data: setProfile, error: setProfileErr } = await supabase
      .from('users')
      .update({
        name,
        avatar_url: secure_url,
        avatar_public_id: public_id,
        bio
      })
      .eq('email', req.user.email);

    if (setProfileErr) {
      return res.json({ success: false });
    }

    return res.json({ success: true });
  } catch (err) {
    return res.json({ success: false });
  }
});

app.get("/fetch_user_details", verifyToken, async (req, res, next) => {
  const { data: rows, error } = await supabase
    .from('users')
    .select('user_id, name, avatar_url, avatar_public_id, bio')
    .eq('email', req.user.email)
    .limit(1);

  if (error || !rows || rows.length === 0) {
    return res.json({});
  }

  return res.json(rows[0]);
});

app.post("/check_username_exist", verifyToken, async (req, res, next) => {
  const { user_id } = req.body;
  const email = req.user.email;

  const { data: rows, error } = await supabase
    .from('users')
    .select('name')
    .eq('user_id', user_id)
    .neq('email', email)
    .limit(1);

  if (error) {
    return res.status(200).json({ exists: false });
  }

  if (rows && rows.length > 0) {
    return res.json({ exists: true });
  } else {
    return res.status(200).json({ exists: false });
  }
});

app.post("/edit_profile", verifyToken, uplod.single("profile_pic"), async (req, res, next) => {
  const profile_pic = req.file;

  try {
    if (profile_pic) {
      const public_id = req.body.public_id;

      const result = await new Promise((resolve, reject) => {
        const upload_stream = cloudinary.uploader.upload_stream(
          { resource_type: "auto", public_id: public_id, overwrite: true },
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );
        streamifier.createReadStream(profile_pic.buffer).pipe(upload_stream);
      });

      const updated_secure_url = result.secure_url;
      const updated_public_id = result.public_id;

      const updated_name = req.body.name;
      const updated_bio = req.body.bio;

      const { data: rows, error } = await supabase
        .from('users')
        .update({
          name: updated_name,
          avatar_url: updated_secure_url,
          avatar_public_id: updated_public_id,
          bio: updated_bio
        })
        .eq('email', req.user.email);

      if (error) {
        return res.json({ success: false });
      }
      return res.json({ success: true });
    } else {
      const updated_name = req.body.name;
      const updated_bio = req.body.bio;

      const { data: rows, error } = await supabase
        .from('users')
        .update({ name: updated_name, bio: updated_bio })
        .eq('email', req.user.email);

      if (error) return res.json({ success: false });
      return res.json({ success: true });
    }
  } catch (err) {
    console.log(err);
    return res.json({ success: false });
  }
});

app.get("/current_user", verifyToken, (req, res, next) => {
  return res.json(req.user);
});

app.get("/fetch_single_user_profile/:user_id", verifyToken, async (req, res, next) => {
  const user_id = req.params.user_id;

  // fetch user
  const { data: rows, error } = await supabase
    .from('users')
    .select('name, user_id, avatar_url, bio')
    .eq('user_id', user_id)
    .limit(1);

  if (error || !rows || rows.length === 0) {
    return res.json({});
  }

  const user = rows[0];

  const no_following = await countRows('follows', 'follower_id', user_id);
  const no_followers = await countRows('follows', 'following_id', user_id);
  const no_posts = await countRows('posts', 'user_id', user_id);

  return res.json({
    name: user.name,
    user_id: user.user_id,
    avatar_url: user.avatar_url,
    bio: user.bio,
    no_following,
    no_followers,
    no_posts
  });
});

app.post("/follow", verifyToken, async (req, res, next) => {
  const follower_id = req.user.user_id;
  const following_id = req.body.following_id;

  const { data: insertFollow, error: followErr } = await supabase
    .from('follows')
    .insert({ follower_id, following_id })
    .select();

  if (followErr) {
    return res.json({ success: false });
  }

  // get avatar of follower
  const { data: result, error: userErr } = await supabase
    .from('users')
    .select('avatar_url')
    .eq('user_id', follower_id)
    .limit(1);

  const followerAvatar = (result && result.length) ? result[0].avatar_url : null;

  // insert notification
  const { data: notifInsert, error: notifErr } = await supabase
    .from('notifications')
    .insert({
      from_id: follower_id,
      to_id: following_id,
      from_profile_pic: followerAvatar,
      message: `${follower_id} started following you`
    })
    .select();

  if (notifErr) {
    // follow created but notification failed — still return success per original behavior if follows created
    return res.json({ success: true });
  }

  // emit socket event if online (handled below)
  const following_sock = users.get(following_id);
  if (following_sock) {
    io.to(following_sock).emit("follow_request", {
      from_id: follower_id,
      from_profile_pic: followerAvatar,
      message: `${follower_id} started following you`,
      created_at: new Date()
    });
  }

  return res.json({ success: true });
});

app.post("/unfollow", verifyToken, async (req, res, next) => {
  const follower_id = req.user.user_id;
  const following_id = req.body.following_id;

  await supabase
    .from('follows')
    .delete()
    .match({ follower_id: follower_id, following_id: following_id });

  return res.json({ success: true });
});

app.post("/is_follower", verifyToken, async (req, res, next) => {
  const follower_id = req.user.user_id;
  const following_id = req.body.following_id;

  const { data: rows, error } = await supabase
    .from('follows')
    .select('*')
    .match({ follower_id, following_id })
    .limit(1);

  if (rows && rows.length > 0) {
    return res.json({ is_follower: true });
  } else {
    return res.json({ is_follower: false });
  }
});

app.get("/fetch_following", verifyToken, async (req, res, next) => {
  const user_id = req.user.user_id;

  const { data: rows, error } = await supabase
    .from('follows')
    .select('following_id')
    .eq('follower_id', user_id);

  const followingIds = (rows || []).map(r => r.following_id);

  // get avatar urls
  let data = [];
  if (followingIds.length > 0) {
    const { data: usersData } = await supabase
      .from('users')
      .select('user_id, avatar_url')
      .in('user_id', followingIds);

    data = usersData || [];
  }

  return res.json({
    data: data.map(d => ({ following_id: d.user_id, avatar_url: d.avatar_url })),
    user_id: user_id
  });
});

app.get("/fetch_notifications", verifyToken, async (req, res, next) => {
  const { data: rows, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('to_id', req.user.user_id)
    .order('created_at', { ascending: false });

  return res.json({ notifications: rows || [] });
});

app.get("/fetch_posts", verifyToken, async (req, res, next) => {
  try {
    // fetch posts ordered by created_at desc
    const { data: posts, error: postsErr } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (postsErr || !posts) return res.json({ posts: [] });

    const enriched = [];
    for (const p of posts) {
      // fetch avatar of post owner
      const { data: userRow } = await supabase
        .from('users')
        .select('avatar_url')
        .eq('user_id', p.user_id)
        .limit(1);

      const avatar_url = (userRow && userRow.length) ? userRow[0].avatar_url : null;

      // fetch files for post
      const { data: files } = await supabase
        .from('post_files')
        .select('file_url')
        .eq('post_id', p.post_id);

      const file_urls = (files || []).map(f => f.file_url);

      enriched.push({
        user_id: p.user_id,
        caption: p.caption,
        created_at: p.created_at,
        post_id: p.post_id,
        avatar_url,
        file_urls
      });
    }

    return res.json({ posts: enriched });
  } catch (err) {
    return res.json({ posts: [] });
  }
});

app.post("/like", verifyToken, async (req, res) => {
  const { post_id, unlike, user_id } = req.body;
  const liked_user_id = req.user.user_id;

  try {
    if (unlike) {
      await supabase
        .from('likes')
        .delete()
        .match({ post_id: post_id, user_id: liked_user_id });
    } else {
      await supabase
        .from('likes')
        .insert({ post_id: post_id, user_id: liked_user_id });

      const { data: result } = await supabase
        .from('users')
        .select('avatar_url')
        .eq('user_id', liked_user_id)
        .limit(1);

      const avatar = (result && result.length) ? result[0].avatar_url : null;

      await supabase
        .from('notifications')
        .insert({
          from_id: liked_user_id,
          to_id: user_id,
          from_profile_pic: avatar,
          post_id: post_id,
          message: `${liked_user_id} liked your post`
        });

      const dest_sock = users.get(user_id);
      if (dest_sock) {
        io.to(dest_sock).emit("like_notify", {
          from: liked_user_id,
          message: `${liked_user_id} likes your post`,
          from_profile_pic: avatar,
          post_id: post_id,
          created_at: new Date()
        });
      }
    }

    return res.json({ success: true });
  } catch (err) {
    return res.json({ success: false, error: err.message });
  }
});

app.get("/fetch_likes", verifyToken, async (req, res, next) => {
  const { data: rows, error } = await supabase
    .from('likes')
    .select('post_id')
    .eq('user_id', req.user.user_id);

  const liked = (rows || []).map(r => r.post_id);

  return res.json({ liked_posts: liked });
});

app.get("/fetch_own_posts", verifyToken, async (req, res, next) => {
  const { data: posts } = await supabase
    .from('posts')
    .select('*');

  const enriched = [];
  for (const p of posts || []) {
    const { data: files } = await supabase
      .from('post_files')
      .select('file_url')
      .eq('post_id', p.post_id);

    enriched.push({
      user_id: p.user_id,
      caption: p.caption,
      created_at: p.created_at,
      post_id: p.post_id,
      avatar_url: null, // original code had users.avatar_url joined; if you want include, fetch users table
      file_urls: (files || []).map(f => f.file_url)
    });
  }

  return res.json({ posts: enriched });
});

app.use("/fetch_own_user_posts", verifyToken, async (req, res, next) => {
  const { data: rows } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', req.user.user_id);

  const enriched = [];
  for (const p of rows || []) {
    const { data: files } = await supabase
      .from('post_files')
      .select('file_url')
      .eq('post_id', p.post_id);

    enriched.push({
      user_id: p.user_id,
      caption: p.caption,
      created_at: p.created_at,
      post_id: p.post_id,
      avatar_url: null,
      file_urls: (files || []).map(f => f.file_url)
    });
  }

  return res.json({ rows: enriched });
});

app.use("/fetch_single_user_posts/:user_id", verifyToken, async (req, res, next) => {
  const { user_id } = req.params;

  const { data: rows } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', user_id);

  const enriched = [];
  for (const p of rows || []) {
    const { data: files } = await supabase
      .from('post_files')
      .select('file_url')
      .eq('post_id', p.post_id);

    enriched.push({
      user_id: p.user_id,
      caption: p.caption,
      created_at: p.created_at,
      post_id: p.post_id,
      avatar_url: null,
      file_urls: (files || []).map(f => f.file_url)
    });
  }

  return res.json({ rows: enriched });
});

app.get("/fetch_messages/:rec_user_id", verifyToken, async (req, res, next) => {
  const { rec_user_id } = req.params;

  // fetch messages where (sender=me and receiver=them) OR (sender=them and receiver=me)
  const { data: rows, error } = await supabase
    .from('messages')
    .select('sender, receiver, message')
    .or(
      `and(sender.eq.${req.user.user_id},receiver.eq.${rec_user_id}),and(sender.eq.${rec_user_id},receiver.eq.${req.user.user_id})`
    )
    .order('time', { ascending: true });

  return res.json({ rows: rows || [] });
});

app.post("/delete_post/:post_id", verifyToken, async (req, res, next) => {
  const { post_id } = req.params;

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('post_id', post_id);

  // Supabase delete does not return affectedRows; assume success if no error
  if (!error) {
    return res.json({ success: true });
  } else {
    return res.json({ success: false });
  }
});

app.get("/fetch_msg_req", verifyToken, async (req, res, next) => {
  const { data: rows, error } = await supabase
    .from('messages')
    .select('sender')
    .eq('receiver', req.user.user_id)
    .distinct();

  const senders = (rows || []).map(r => r.sender);

  let avatars = [];
  if (senders.length > 0) {
    const { data: usersData } = await supabase
      .from('users')
      .select('user_id, avatar_url')
      .in('user_id', senders);

    avatars = usersData || [];
  }

  const result = (senders || []).map(sid => {
    const av = avatars.find(a => a.user_id === sid);
    return { following_id: sid, avatar_url: av ? av.avatar_url : null };
  });

  return res.json({ rows: result });
});

// Socket.io + server
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const users = new Map();

io.on("connection", (sock) => {
  sock.on("register", (userid) => {
    users.set(userid, sock.id);
  });

  sock.on("sent_message", async (data) => {
    const { sender, receiver, message } = data;

    const { data: inserted, error } = await supabase
      .from('messages')
      .insert({ sender, receiver, message })
      .select();

    if (!error && inserted && inserted.length > 0) {
      const dest = users.get(receiver);
      if (dest) {
        io.to(dest).emit("receive", { sender, receiver, message });
      }
    }
  });
});

server.listen(process.env.PORT, () => {
  console.log("Server Running Successfully");
});













