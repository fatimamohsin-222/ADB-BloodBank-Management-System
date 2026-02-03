// seed.js
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");

const Donor = require("./models/Donor");
const Donation = require("./models/donation");
const Recipient = require("./models/recipient");
const Request = require("./models/request");
const Transfusion = require("./models/transfusion");

// MongoDB URI
mongoose.connect("mongodb://localhost:27017/bloodbanksystem", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//extra
// Generates random [longitude, latitude] within Lahore
function getRandomLahoreCoords() {
  const lahoreLat = 31.5204;
  const lahoreLng = 74.3587;
  const lat = lahoreLat + (Math.random() - 0.5) * 0.05; // ±0.025 variation
  const lng = lahoreLng + (Math.random() - 0.5) * 0.05;
  return [lng, lat]; // MongoDB expects [longitude, latitude]
}

//extra
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const genders = ["Male", "Female", "Other"];

function getRandomBloodGroup() {
  return bloodGroups[Math.floor(Math.random() * bloodGroups.length)];
}

function getRandomGender() {
  return genders[Math.floor(Math.random() * genders.length)];
}

function getRandomDateWithinLastMonths(months = 6) {
  const days = Math.floor(Math.random() * (months * 30));
  return faker.date.recent(days);
}

async function seed() {
  await Donor.deleteMany({});
  await Donation.deleteMany({});
  await Recipient.deleteMany({});
  await Request.deleteMany({});
  await Transfusion.deleteMany({});

  const donors = [];
  const recipients = [];
  const donations = [];

  // --- Donors (30–50)
  for (let i = 0; i < 40; i++) {
    const lastDonated =
      Math.random() < 0.8 ? getRandomDateWithinLastMonths() : null;
    const donor = new Donor({
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      phone: faker.phone.number("03#########"),
      bloodGroup: getRandomBloodGroup(),
      gender: getRandomGender(),
      address: faker.location.streetAddress(),
      city: "Lahore",
      coordinates: getRandomLahoreCoords(),

      lastDonated,
    });
    await donor.save();
    donors.push(donor);
  }

  // --- Donations (50+)
  for (let i = 0; i < 60; i++) {
    const donor = donors[Math.floor(Math.random() * donors.length)];
    const donationDate = getRandomDateWithinLastMonths(4);
    const expiryDate = new Date(donationDate);
    expiryDate.setDate(expiryDate.getDate() + 42);
    const donation = new Donation({
      donor: donor._id,
      bloodGroup: donor.bloodGroup,
      donationDate,
      expiryDate,
    });
    await donation.save();
    donations.push(donation);
  }

  // --- Recipients (30–40)
  for (let i = 0; i < 35; i++) {
    const recipient = new Recipient({
      name: faker.person.fullName(),
      phone: faker.phone.number("03#########"),
      bloodGroup: getRandomBloodGroup(),
      city: "Lahore",
      gender: getRandomGender(),
    });
    await recipient.save();
    recipients.push(recipient);
  }

  // --- Requests (30–40)
  for (let i = 0; i < 35; i++) {
    const recipient = recipients[Math.floor(Math.random() * recipients.length)];
    const statusOptions = ["Pending", "Fulfilled", "Cancelled"];
    const status =
      Math.random() < 0.5
        ? "Pending"
        : statusOptions[Math.floor(Math.random() * 3)];
    const request = new Request({
      recipient: recipient._id,
      bloodGroup: recipient.bloodGroup,
      quantity: faker.number.int({ min: 1, max: 3 }),
      status,
      requestDate: getRandomDateWithinLastMonths(),
    });
    await request.save();
  }

  // --- Transfusions (20–30)
  for (let i = 0; i < 25; i++) {
    const donor = donors[Math.floor(Math.random() * donors.length)];
    const recipient = recipients[Math.floor(Math.random() * recipients.length)];

    const compatible = checkCompatibility(
      donor.bloodGroup,
      recipient.bloodGroup
    );
    const donation = donations.find(
      (d) => d.donor.toString() === donor._id.toString()
    );
    const isExpired = donation && donation.expiryDate < new Date();
    const status = compatible && !isExpired ? "Successful" : "Failed";

    const transfusion = new Transfusion({
      donor: donor._id,
      recipient: recipient._id,
      bloodGroup: donor.bloodGroup,
      status,
    });
    await transfusion.save();
  }

  console.log("✅ Database seeded successfully!");
  mongoose.disconnect();
}

// Compatibility logic
function checkCompatibility(donor, recipient) {
  const compatible = {
    "O-": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
    "O+": ["O+", "A+", "B+", "AB+"],
    "A-": ["A-", "A+", "AB-", "AB+"],
    "A+": ["A+", "AB+"],
    "B-": ["B-", "B+", "AB-", "AB+"],
    "B+": ["B+", "AB+"],
    "AB-": ["AB-", "AB+"],
    "AB+": ["AB+"],
  };
  return compatible[donor]?.includes(recipient);
}

seed();