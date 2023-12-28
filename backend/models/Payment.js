const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    razorpay_order_id: {
      type: String,
      required: trusted,
    },
    razorpay_payment_id: {
      type: String,
      requried: true,
    },
    razorpay_signature: {
      type: String,
      requried: true,
    },
  },
  { timestamps: ture }
);

module.exports = mongoose.model("Payment", paymentSchema);
