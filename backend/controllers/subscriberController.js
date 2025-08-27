// controllers/subscriberController.js
const Subscriber = require("../models/subscriber");

// Create new subscription
const createSubscriber = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Prevent duplicate subscriptions
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already subscribed" });
    }

    const subscriber = await Subscriber.create({ email });
    res.status(201).json(subscriber);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all subscribers
const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update subscription status (unsubscribe, resubscribe)
const updateSubscriberStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "subscribed" or "unsubscribed"

    const subscriber = await Subscriber.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!subscriber) {
      return res.status(404).json({ error: "Subscriber not found" });
    }

    res.json(subscriber);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createSubscriber,
  getSubscribers,
  updateSubscriberStatus,
};
