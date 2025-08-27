// models/subscriber.js
const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    status: { type: String, default: "subscribed" }, // subscribed / unsubscribed
  },
  { timestamps: true }
);

const Subscriber = mongoose.model("Subscriber", subscriberSchema);
module.exports = Subscriber;
