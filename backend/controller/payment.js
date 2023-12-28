const { catchAsyncError } = require("../middlewares/catchAsyncError");
const Payment = require("../models/Payment.js");
const instance = require('../server.js');
const ErrorHandler = require("../utils/ErrorHandler.js");
const crypto = require("crypto");


exports.getRazorpayKey = catchAsyncError(async(req, res, next) => {
    const key_id = process.env.RAZORPAY_API_KEY;

    return res.status(200).json({
        key_id
    });
});


exports.checkout = catchAsyncError(async(req, res, next) => {
    const options = {
        amount: Number(req.body.amount*100),
        currency: "INR"
    };

    const order = await instance.orders.create(options);

    return res.status(201).json({
        success: true,
        order,
    });
});


exports.paymentVerification = catchAsyncError(async(req, res, next) => {
    const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;

    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature){
        return next(new ErrorHandler("verification credentials are missing!!", 400));
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const generatedPaymentSignature = crypto.createHmac("sha256", process.env.RAZORPAY_API_SECRET).update(body.toString()).digest("hex");

    if(generatedPaymentSignature === razorpay_signature){
        //store in database
        const paymentDetails = {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        };

        await Payment.create(paymentDetails);

        res.redirect("url of success payment page with razorpay_payment_id as refference");
    } else {
        return res.status(400).json({
            success: false
        });
    }

});