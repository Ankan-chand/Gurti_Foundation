// const express = require("express");    // requiring express
const mongoose = require("mongoose"); // requiring mongoose

//exporting connnectDatabase function
exports.connectDatabase = () => {
  // Set the strictQuery option to true
  mongoose.set("strictQuery", true);
  mongoose
    .connect(process.env.MONGO_URI)
    .then((con) => {
      console.log(`connected to the database at ${con.connection.host}`);
    })
    .catch((err) => {
      console.log(err);
    });
};
