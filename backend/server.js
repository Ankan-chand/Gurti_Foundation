const app = require('./app');   //requiring app module

//connecting database
const {connectDatabase} = require("./config/database");
connectDatabase();



//listening to the port
app.listen(process.env.PORT, ()=>{
    console.log(`Server listening on port ${process.env.PORT}`);
});