const express = require('express');
const router = express.Router();
const Donation = require('../models/donation');

// POST /api/donations - Add a new donation
router.post('/', async (req, res) => {
  try {
    const newDonation = new Donation(req.body);
    const savedDonation = await newDonation.save();
    res.status(201).json({ success: true, donation: savedDonation });
  } catch (err) {
    console.error('Error saving donation:', err);
    res.status(500).json({ success: false, message: 'Error saving donation' });
  }
});

// GET /api/donations - Get all donations
router.get('/', async (req, res) => {
  try {
    const donations = await Donation.find();
    res.status(200).json({ success: true, donations });
  } catch (err) {
    console.error('Error fetching donations:', err);
    res.status(500).json({ success: false, message: 'Error fetching donations' });
  }
});



module.exports = router;
