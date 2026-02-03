// routes/recipientRoutes.js
const express = require('express');
const router = express.Router();
const Recipient = require('../models/Recipient');

// POST /api/recipients - Add a new recipient
router.post('/', async (req, res) => {
  try {
    const newRecipient = new Recipient(req.body);
    const savedRecipient = await newRecipient.save();
    res.status(201).json({ success: true, recipient: savedRecipient });
  } catch (err) {
    console.error('Error saving recipient:', err);
    res.status(500).json({ success: false, message: 'Error saving recipient' });
  }
});

// GET /api/recipients - Get all recipients
router.get('/', async (req, res) => {
  try {
    const recipients = await Recipient.find();
    res.status(200).json({ success: true, recipients });
  } catch (err) {
    console.error('Error fetching recipients:', err);
    res.status(500).json({ success: false, message: 'Error fetching recipients' });
  }
});

module.exports = router;