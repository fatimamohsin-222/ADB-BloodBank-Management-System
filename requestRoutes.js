const express = require('express');
const router = express.Router();
const Request = require('../models/request');

// POST /api/requests - Add a new blood request
router.post('/', async (req, res) => {
  try {
    const newRequest = new Request(req.body);
    const savedRequest = await newRequest.save();
    res.status(201).json({ success: true, request: savedRequest });
  } catch (err) {
    console.error('Error saving request:', err);
    res.status(500).json({ success: false, message: 'Error saving request' });
  }
});

// GET /api/requests - Get all blood requests
router.get('/', async (req, res) => {
  try {
    const requests = await Request.find();
    res.status(200).json({ success: true, requests });
  } catch (err) {
    console.error('Error fetching requests:', err);
    res.status(500).json({ success: false, message: 'Error fetching requests' });
  }
});

// GET /api/requests/stats - Request stats
router.get('/stats', async (req, res) => {
  try {
    const requests = await Request.find();
    const total = requests.length;
    const statusCount = { Pending: 0, Fulfilled: 0, Cancelled: 0 };

    requests.forEach(req => {
      if (statusCount[req.status]) statusCount[req.status]++;
    });

    const fulfilled = statusCount['Fulfilled'] || 0;
    const fulfillmentRate = total ? ((fulfilled / total) * 100).toFixed(2) : 0;

    res.json({ totalRequests: total, statusCount, fulfillmentRate });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error getting stats' });
  }
});


// GET /api/requests/shortage-alerts - Check if requests > donations
router.get('/shortage-alerts', async (req, res) => {
  try {
    const requests = await Request.find();
    const donations = await require('../models/donation').find();

    const reqCount = {};
    const donCount = {};

    requests.forEach(r => {
      reqCount[r.bloodGroup] = (reqCount[r.bloodGroup] || 0) + 1;
    });

    donations.forEach(d => {
      donCount[d.bloodGroup] = (donCount[d.bloodGroup] || 0) + 1;
    });

    const shortages = [];

    for (const bg in reqCount) {
      if ((donCount[bg] || 0) < reqCount[bg]) {
        shortages.push({
          bloodGroup: bg,
          requests: reqCount[bg],
          available: donCount[bg] || 0
        });
      }
    }

    res.json({ shortages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error checking shortages' });
  }
});



module.exports = router;