const express = require('express');
const router = express.Router();
const Transfusion = require('../models/transfusion');

// POST /api/transfusions - Add a new transfusion
router.post('/', async (req, res) => {
  try {
    const newTransfusion = new Transfusion(req.body);
    const savedTransfusion = await newTransfusion.save();
    res.status(201).json({ success: true, transfusion: savedTransfusion });
  } catch (err) {
    console.error('Error saving transfusion:', err);
    res.status(500).json({ success: false, message: 'Error saving transfusion' });
  }
});

// GET /api/transfusions - Get all transfusions
router.get('/', async (req, res) => {
  try {
    const transfusions = await Transfusion.find();
    res.status(200).json({ success: true, transfusions });
  } catch (err) {
    console.error('Error fetching transfusions:', err);
    res.status(500).json({ success: false, message: 'Error fetching transfusions' });
  }
});

// GET /api/transfusions/stats - Success vs Failure
router.get('/stats', async (req, res) => {
  try {
    const transfusions = await Transfusion.find();
    const total = transfusions.length;

    const success = transfusions.filter(t => t.status === 'Successful').length;
    const failure = transfusions.filter(t => t.status === 'Failed').length;

    res.json({ totalTransfusions: total, success, failure });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching transfusion stats' });
  }
});


router.post('/', async (req, res) => {
  try {
    const { donor, recipient } = req.body;

    const Donor = require('../models/Donor');
    const Recipient = require('../models/recipient');

    const donorData = await Donor.findById(donor);
    const recipientData = await Recipient.findById(recipient);

    if (!donorData || !recipientData) {
      return res.status(404).json({ success: false, message: 'Donor or Recipient not found' });
    }

    const donorBG = donorData.bloodGroup;
    const recipientBG = recipientData.bloodGroup;

    const compatibilityMap = {
      'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
      'O+': ['O+', 'A+', 'B+', 'AB+'],
      'A-': ['A-', 'A+', 'AB-', 'AB+'],
      'A+': ['A+', 'AB+'],
      'B-': ['B-', 'B+', 'AB-', 'AB+'],
      'B+': ['B+', 'AB+'],
      'AB-': ['AB-', 'AB+'],
      'AB+': ['AB+']
    };

    const isCompatible = compatibilityMap[donorBG]?.includes(recipientBG);
    const status = isCompatible ? 'Successful' : 'Failed';

    const newTransfusion = new Transfusion({
      donor,
      recipient,
      bloodGroup: donorBG,
      status
    });

    const savedTransfusion = await newTransfusion.save();
    res.status(201).json({ success: true, transfusion: savedTransfusion });

  } catch (err) {
    console.error('Error saving transfusion:', err);
    res.status(500).json({ success: false, message: 'Error saving transfusion' });
  }
});


module.exports = router;