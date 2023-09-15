const ErrorHandler = require("../utils/ErrorHandler");
const { catchAsyncError } = require("../middlewares/catchAsyncError");
const { sendEmail } = require("../middlewares/sendEmail");
const {contactUs} = require("../middlewares/contact");
const User = require("../models/User"); //requiring user model
const crypto = require("crypto");
const getDataUri = require("../utils/dataUri");
const cloudinary = require("cloudinary");

//exports registerUser function
exports.registerUser = catchAsyncError(async (req, res, next) => {
  //extract name, email, password from request body
  const { name, email, password } = req.body;
  const file = req.file;

  if(!name || !email || !password){
    return next(new ErrorHandler("Please fill all fields", 400));
  }

  //check if user is already registered
  let user = await User.findOne({ email });

  //if user is already registered then return
  if (user) {
    return next(new ErrorHandler("User already exists", 404));
  }

  const newUser = {
    name:name,
    email:email,
    password:password,
  }

  if(file){
    const fileuri = getDataUri(file);
    const myCloud = await cloudinary.v2.uploader.upload(fileuri.content);

    newUser["avatar"] = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url
    }
  }

  //if user is not registered then create
  user = await User.create(newUser);

  const count = await User.countDocuments();
  if (count === 1) {
    user.role = "admin";
    await user.save();
  }

  //sending success response
  res.status(201).json({
    success: true,
    message: "User created successfully",
  });
});

//exports loginUser function
exports.userLogin = catchAsyncError(async (req, res, next) => {
  //extracting email and password from request body
  const { email, password } = req.body;

  //find user using email
  let user = await User.findOne({ email }).select("+password");

  //if user is not found then return
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (user.role === "admin") {
    //check if password is correct
    const isMatch = await user.matchPassword(password);

    if (isMatch) {
      //generating json web token(jwt) for user using  the `generateToken()` method defined in the `User` model
      const token = await user.generateToken();

      //set the token as a cookie with the expiration time of 90 days
      const options = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      //sending success response with user object and token
      res.status(200).cookie("token", token, options).json({
        success: true,
        message: "User logged in successfully",
        user,
        token,
      });
    } else {
      //if user is not matched
      return next(new ErrorHandler("Password is incorrect", 400));
    }
  } else {
    //if user is not admin
    return next(new ErrorHandler("User not authorized", 401));
  }
});

//exports userLogout function
exports.userLogout = catchAsyncError(async (req, res, next) => {
  //clear token using clearCookie
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
});

//exports promoteAdmin function
exports.promoteAdmin = catchAsyncError(async (req, res, next) => {
  // extract the email address from the request body
  const { email } = req.body;

  //find the user usign email address
  let user = await User.findOne({ email });

  //if user is not found return
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  //if user is already admin then return otherwise promoted user to admin
  if (user.role === "admin") {
    return next(new ErrorHandler("The user is already an admin", 400));
  } else {
    user.role = "admin";
    await user.save();
    res.status(200).json({
      success: true,
      message: "User promoted to admin successfully",
    });
  }
});

exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const resetPasswordToken = await user.generateResetPasswordToken();

  await user.save();

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetPasswordToken}`;

  const message = `To reset your password please click on the link below. If it is not done by you then please ignore this mail./n/n ${resetPasswordUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email Sent to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    next(new ErrorHandler(error.message, 500));
  }
});

exports.resetPassword =catchAsyncError( async (req, res, next) => {

  //extract the resetPasswordToken from the request params
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorHandler("Password reset token is invalid or has expired", 400));
    }

    const { password } = req.body;
    user.password = password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

});

exports.contactToAdmin = catchAsyncError(async(req, res, next) => {
    const {email, name, subject} = req.body;
    if(!email || !name || !subject){
      return next(new ErrorHandler("Please fill all the fields", 400));
    }

    const options = {
      email:email,
      name:name,
      subject:subject
    }

    try {
      await contactUs(options);

      res.status(200).json({
        success: true,
        message: "Email Sent to Admin",
      });
      
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
    
});


