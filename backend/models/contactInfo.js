const mongoose = require('mongoose');

const contactInfoSchema = new mongoose.Schema({
  address: { type: String, required: true },
  phone1: { type: String, required: true },
  phone2: { type: String },
  email: { type: String, required: true },
  socials: {
    facebook: { type: String },
    youtube: { type: String },
  },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
});

const ContactInfo = mongoose.model('ContactInfo', contactInfoSchema);

module.exports = ContactInfo;