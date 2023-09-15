const cloudinary = require("cloudinary");
const getDataUri = require("../utils/dataUri");
const File = require("../models/file");
const { catchAsyncError } = require("../middlewares/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");

exports.getFiles = catchAsyncError(async(req, res, next) => {
    const files = await File.find();

    res.status(200).json({
        success: true,
        files
    });
});


exports.uploadFile = catchAsyncError(async (req, res, next) => {
    const file = req.file;
    const {filename} = req.body;
    if(!file || !filename){
        return next(new ErrorHandler("Please fill all field", 400));
    }
    
    const fileuri = getDataUri(file);
    const myCloud = await cloudinary.v2.uploader.upload(fileuri.content);

    const newFile = {
        fileName: filename,

        fileUrl:{
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    }

    await File.create(newFile);

    res.status(200).json({
        success: true,
        message:"File uploaded successfully"
    });
});



