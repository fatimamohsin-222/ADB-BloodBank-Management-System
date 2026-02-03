const express = require("express");
const router = express.Router();
const Donor = require("../models/Donor");
const axios = require("axios");

// POST /api/donors - Add donor (must be from Lahore)
router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      bloodGroup,
      lastDonated,
      address,
      city,
      gender, // ✅ Added gender
    } = req.body;

    // Only allow donors from Lahore
    if (!/lahore/i.test(city)) {
      return res.status(400).json({
        success: false,
        message: "Only donors from Lahore are accepted.",
      });
    }

    // Geocode full address
    const fullAddress = `${address}, ${city}, Pakistan`;
    const geoRes = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: fullAddress,
          format: "json",
          limit: 1,
        },
        headers: {
          "User-Agent": "BloodBankApp/1.0",
        },
      }
    );

    if (!geoRes.data || geoRes.data.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Could not find coordinates for the provided address.",
      });
    }

    const coordinates = [
      parseFloat(geoRes.data[0].lon),
      parseFloat(geoRes.data[0].lat),
    ];

    // Create new donor
    const newDonor = new Donor({
      name,
      email,
      phone,
      bloodGroup,
      gender, // ✅ Save gender here
      lastDonated,
      address,
      city,
      coordinates,
    });

    const savedDonor = await newDonor.save();
    res.status(201).json({ success: true, donor: savedDonor });
  } catch (err) {
    console.error("Error saving donor:", err);
    res.status(500).json({ success: false, message: "Error saving donor" });
  }
});

// GET /api/donors - Filter/search donors
router.get("/", async (req, res) => {
  try {
    const { name, bloodGroup, city } = req.query;
    const query = {};

    if (name) query.name = { $regex: name, $options: "i" };
    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (city) query.city = { $regex: city, $options: "i" };

    const donors = await Donor.find(query);
    res.json({ success: true, donors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/donors/map - Donors for Leaflet map
router.get("/map", async (req, res) => {
  try {
    const donors = await Donor.find({
      coordinates: { $exists: true },
      city: { $regex: /lahore/i },
    });
    res.json(donors);
  } catch (err) {
    console.error("Error fetching map donors:", err);
    res
      .status(500)
      .json({ success: false, message: "Error fetching donor locations" });
  }
});

module.exports = router;