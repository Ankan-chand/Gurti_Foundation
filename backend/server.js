const app = require('./app');   
const cloudinary = require("cloudinary");
const Razorpay = require('razorpay');

if(process.env.NODE_ENV !== "production"){
  require("dotenv").config({path:"backend/config/config.env"});
}


//connecting database
const {connectDatabase} = require("./config/database");
connectDatabase();


//razorpay configuration
const instance = new Razorpay({
  key_id:process.env.RAZORPAY_API_KEY,
  key_secret:process.env.RAZORPAY_API_SECRET
});

//cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_USER_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



//listening to the port
app.listen(process.env.PORT, ()=>{
    console.log(`Server listening on port ${process.env.PORT}`);
});

module.exports = instance;