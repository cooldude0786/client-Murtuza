const StoreConfig = require('../models/StoreConfig');

// Get the current store configuration
exports.getConfig = async (req, res) => {
  try {
    // findOne() will get the single config document
    const config = await StoreConfig.findOne();
    if (!config) {
      return res.status(404).json({ msg: 'Configuration not found.' });
    }
    res.json(config);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Create or update the configuration (for admin use)
exports.updateConfig = async (req, res) => {
  try {
    const config = await StoreConfig.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true, // Creates the document if it doesn't exist
    });
    res.json(config);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};