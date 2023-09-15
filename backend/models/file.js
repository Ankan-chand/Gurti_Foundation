const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    
    fileName: String,

    fileUrl:{
        public_id: String,
        url: String,
    },

});

module.exports = mongoose.model("File", fileSchema);