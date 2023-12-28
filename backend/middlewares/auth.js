const User = require("../models/User");
const jwt = require("jsonwebtoken");
const {catchAsyncError} = require("./catchAsyncError.js");
const ErrorHandler = require("../utils/ErrorHandler");

exports.isAuthenticated = catchAsyncError( async (req, res, next) => {

    const { token } = req.cookies;

    if (!token) {
      return next(new ErrorHandler("Please login first!!", 401));
    }

    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedToken._id);

    next();
    
});


