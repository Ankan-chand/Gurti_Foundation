const { sendEmail } = require("../middlewares/sendEmail");
const User = require("../models/User"); //requiring user model
const crypto = require("crypto");

//exports registerUser function
exports.registerUser = async (req, res) => {
  try {
    //extract name, email, password from request body
    const { name, email, password } = req.body;

    //check if user is already registered
    let user = await User.findOne({ email });

    //if user is already registered then return
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    //if user is not registered then create
    user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: "sample_id",
        url: "sample_url",
      },
    });

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//exports loginUser function
exports.userLogin = async (req, res) => {
  try {
    //extracting email and password from request body
    const { email, password } = req.body;

    //find user using email
    let user = await User.findOne({ email }).select("+password");

    //if user is not found then return
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
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
        res.status(400).json({
          success: false,
          message: "Password is incorrect",
        });
      }
    } else {
      //if user is not admin
      res.status(400).json({
        success: false,
        message: "User not authorized",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//exports userLogout function
exports.userLogout = async (req, res) => {
  try {
    //clear token using clearCookie
    res.clearCookie("token");
    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//exports promoteAdmin function
exports.promoteAdmin = async (req, res) => {
  try {
    // extract the email address from the request body
    const { email } = req.body;

    //find the user usign email address
    let user = await User.findOne({ email });

    //if user is not found return
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    //if user is already admin then return otherwise promoted user to admin
    if (user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "The user is already an admin",
      });
    } else {
      user.role = "admin";
      await user.save();
      res.status(200).json({
        success: true,
        message: "User promoted to admin successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
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

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    //extract the resetPasswordToken from the request body
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Password reset token is invalid or has expired",
      });
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//***upload documents***
