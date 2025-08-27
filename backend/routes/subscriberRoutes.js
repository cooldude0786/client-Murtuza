// routes/subscriberRoutes.js
const express = require("express");
const router = express.Router();
const {
  createSubscriber,
  getSubscribers,
  updateSubscriberStatus,
} = require("../controllers/subscriberController");

// POST /api/subscribers → subscribe new email
router.post("/", createSubscriber);

// GET /api/subscribers → get all subscribers
router.get("/", getSubscribers);

// PATCH /api/subscribers/:id/status → update status
router.patch("/:id/status", updateSubscriberStatus);

module.exports = router;
