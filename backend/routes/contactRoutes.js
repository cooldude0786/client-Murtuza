const express = require('express');
const router = express.Router();
const {
  getContactInfo,
  updateContactInfo,
  deleteContactInfo,
} = require('../controllers/contactController');

// @route   GET /api/contact
// @desc    Fetch the contact info
router.get('/', getContactInfo);

// @route   POST /api/contact
// @desc    Create or update the contact info
router.post('/', updateContactInfo);

// @route   DELETE /api/contact
// @desc    Delete the contact info
router.delete('/', deleteContactInfo);


module.exports = router;