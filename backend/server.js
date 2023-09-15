const app = require('./app');   //requiring app module
const cloudinary = require("cloudinary");

//connecting database
const {connectDatabase} = require("./config/database");
connectDatabase();


//cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_USER_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



//listening to the port
app.listen(process.env.PORT, ()=>{
    console.log(`Server listening on port ${process.env.PORT}`);
});

