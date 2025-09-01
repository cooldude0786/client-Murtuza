// controllers/contactUserController.js
const Contact = require("../models/contact.js");

// Create new contact
const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    console.log(name)
    const contact = await Contact.create({
      name,
      email,
      message,
      status: "open", // default status
    });
    res.status(201).json(contact);
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ error: err.message });
  }
};

// Get all contacts
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update contact status
const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!contact) return res.status(404).json({ error: "Contact not found" });
    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createContact,
  getContacts,
  updateContactStatus,
};
