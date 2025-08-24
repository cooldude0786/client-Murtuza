const ContactInfo = require('../models/contactInfo');

/**
 * @desc    Get the contact information
 * @route   GET /api/contact
 * @access  Public
 */
exports.getContactInfo = async (req, res) => {
  try {
    const info = await ContactInfo.findOne();
    if (!info) {
      return res.status(404).json({ msg: 'Contact information not found' });
    }
    res.json(info);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * @desc    Create or update the contact information
 * @route   POST /api/contact
 * @access  Private
 */
exports.updateContactInfo = async (req, res) => {
  try {
    // Find the single document and update it, or create it if it doesn't exist (upsert).
    const info = await ContactInfo.findOneAndUpdate({}, req.body, { 
      new: true, 
      upsert: true,
      runValidators: true,
    });
    res.status(201).json(info);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


/**
 * @desc    Delete the contact information
 * @route   DELETE /api/contact
 * @access  Private
 */
exports.deleteContactInfo = async (req, res) => {
  try {
    const info = await ContactInfo.findOneAndDelete({});
    if (!info) {
      return res.status(404).json({ msg: 'Contact information not found' });
    }
    res.json({ msg: 'Contact information deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};