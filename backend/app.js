const express = require("express");
const cookieParser = require("cookie-parser");
const userRoutes = require('./routes/user');
const blogRoutes = require('./routes/blog');
const fileRoutes = require('./routes/file');
const paymentRoutes = require('./routes/payment');
const { errorMiddleware } = require("./middlewares/Error");
const app = express();


//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


//routes
app.use('/api/v1', paymentRoutes);
app.use('/api/v1', fileRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', blogRoutes);


app.use(errorMiddleware);

module.exports = app;