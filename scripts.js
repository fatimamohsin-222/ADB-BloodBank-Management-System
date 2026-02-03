// scripts.js
import { 
  getDonors, 
  getRecipients, 
  getDonations, 
  getTransfusions,
  getRequests
} from './api.js';

import {
  renderGenderChart,
  renderBloodGroupChart,
  renderDonationHeatmap,
  renderDonationBloodGroupChart,
  renderPieChart,
  renderBarChart,
  renderRecipientBloodGroupChart,
  renderRequestStatusChart
} from './chart.js';

// =====================
// Helper Functions
// =====================

const countByGender = (people) => {
  return people.reduce((acc, person) => {
    acc[person.gender] = (acc[person.gender] || 0) + 1;
    return acc;
  }, { Male: 0, Female: 0, Other: 0 });
};

const countByBloodGroup = (people) => {
  return people.reduce((acc, person) => {
    acc[person.bloodGroup] = (acc[person.bloodGroup] || 0) + 1;
    return acc;
  }, {});
};

const countDonationsByBloodGroup = (donations) => {
  return donations.reduce((acc, donation) => {
    acc[donation.bloodGroup] = (acc[donation.bloodGroup] || 0) + 1;
    return acc;
  }, {});
};

// Count requests by status
const countByRequestStatus = (requests) => {
  return requests.reduce((acc, req) => {
    acc[req.status] = (acc[req.status] || 0) + 1;
    return acc;
  }, {});
};

// Calculate average donations per month
const averageDonationsPerMonth = (donations) => {
  if (!donations.length) return 0;

  const dates = donations
    .map(d => new Date(d.donationDate || d.date))
    .filter(date => !isNaN(date));

  if (!dates.length) return 0;

  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));

  const months = (maxDate.getFullYear() - minDate.getFullYear()) * 12 + (maxDate.getMonth() - minDate.getMonth()) + 1;

  return (donations.length / months).toFixed(2);
};

// Filter expiring and expired donations based on 42 days expiry period
const filterExpiringAndExpired = (donations) => {
  const today = new Date();
  const EXPIRY_DAYS = 42;
  const WARNING_DAYS = 7;

  const expiring = [];
  const expired = [];

  donations.forEach(donation => {
    const donationDate = new Date(donation.donationDate || donation.date);
    if (isNaN(donationDate)) return;

    const diffDays = (today - donationDate) / (1000 * 60 * 60 * 24);

    if (diffDays >= EXPIRY_DAYS) {
      expired.push(donation);
    } else if (diffDays >= (EXPIRY_DAYS - WARNING_DAYS)) {
      expiring.push(donation);
    }
  });

  return { expiring, expired };
};

// =====================
// UI population helpers
// =====================

const populateRecentDonations = (donations, donors) => {
  const container = document.getElementById('recent-donations-list');
  if (!container) return;

  // Sort donations by date descending, show top 5
  const sortedDonations = donations
    .slice()
    .sort((a, b) => new Date(b.donationDate || b.date) - new Date(a.donationDate || a.date))
    .slice(0, 5);

  container.innerHTML = sortedDonations.map(donation => {
    const donor = donors.find(d => d._id === donation.donorId) || {};
    const donorName = donor.name || 'Unknown Donor';
    const dateStr = new Date(donation.donationDate || donation.date).toLocaleDateString();

    return `
      <li>
        <strong>${donorName}</strong> - ${donation.bloodGroup} - ${dateStr}
      </li>
    `;
  }).join('');
};

const populateExpiringLists = (expiryData, donors) => {
  const expiringContainer = document.getElementById('expiring-donations-list');
  const expiredContainer = document.getElementById('expired-donations-list');

  expiringContainer.innerHTML = expiryData.expiring.map(donation => {
    const donor = donors.find(d => d._id === donation.donorId) || {};
    const donorName = donor.name || 'Unknown Donor';
    return `<li>${donorName} - ${donation.bloodGroup} - Expires Soon (within 7 days)</li>`;
  }).join('') || '<li>No expiring donations.</li>';

  expiredContainer.innerHTML = expiryData.expired.map(donation => {
    const donor = donors.find(d => d._id === donation.donorId) || {};
    const donorName = donor.name || 'Unknown Donor';
    return `<li>${donorName} - ${donation.bloodGroup} - Expired</li>`;
  }).join('') || '<li>No expired donations.</li>';
};

const displayAvgDonationFrequency = (avgFrequency) => {
  const elem = document.getElementById('avg-donation-frequency');
  if (!elem) return;
  elem.textContent = `Average Donations per Month: ${avgFrequency}`;
};

/*const updateCounters = (donors, recipients, donations, transfusions) => {
  document.getElementById('total-donors').textContent = donors.length;
  document.getElementById('total-recipients').textContent = recipients.length;
  document.getElementById('total-donations').textContent = donations.length;
  document.getElementById('total-transfusions').textContent = transfusions.length;
};*/
const updateCounters = (donors, recipients, donations, transfusions, requests) => {
  document.getElementById('total-donors').textContent = donors.length;
  document.getElementById('total-recipients').textContent = recipients.length;
  document.getElementById('total-donations').textContent = donations.length;
  document.getElementById('total-transfusions').textContent = transfusions.length;
  document.getElementById('total-requests').textContent = requests.length;
};


// Render calendar heatmap
function renderSimpleCalendarHeatmap(donationDates, selector = '#donationHeatmap') {
  const container = document.querySelector(selector);
  if (!container) return;
  container.innerHTML = '';

  const counts = {};
  donationDates.forEach(dateStr => {
    const d = new Date(dateStr);
    if (isNaN(d)) return;
    const dayKey = d.toISOString().slice(0, 10);
    counts[dayKey] = (counts[dayKey] || 0) + 1;
  });

  const today = new Date();
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d);
  }

  let tooltip = document.querySelector('.tooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    document.body.appendChild(tooltip);
  }

  function getLevel(count) {
    if (count >= 10) return 4;
    if (count >= 5) return 3;
    if (count >= 2) return 2;
    if (count >= 1) return 1;
    return 0;
  }

  days.forEach(day => {
    const dayKey = day.toISOString().slice(0, 10);
    const count = counts[dayKey] || 0;

    const div = document.createElement('div');
    div.className = 'heatmap-day';
    if (count > 0) div.classList.add(`level-${getLevel(count)}`);

    div.title = `${dayKey}: ${count} donation${count !== 1 ? 's' : ''}`;

    div.addEventListener('mousemove', e => {
      tooltip.style.opacity = 1;
      tooltip.style.left = e.pageX + 10 + 'px';
      tooltip.style.top = e.pageY + 10 + 'px';
      tooltip.textContent = div.title;
    });
    div.addEventListener('mouseout', () => {
      tooltip.style.opacity = 0;
    });

    container.appendChild(div);
  });
}

// =====================
// Additional Analytics for Requests, Transfusions, Recipients
// =====================

const renderRequestAnalytics = (requests) => {
  const statusCounts = countByRequestStatus(requests);
  renderRequestStatusChart(statusCounts);
};

const renderTransfusionStats = (transfusions) => {
  const successCount = transfusions.filter(t => t.status === 'Successful').length;
  const failureCount = transfusions.filter(t => t.status === 'Failed').length;

  renderPieChart(
    'transfusionStatusChart',
    ['Successful', 'Failed'],
    [successCount, failureCount],
    ['#66FF66', '#FF6666'],
    {
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Transfusion Success Rate' }
      }
    }
  );
};

const renderRecipientAnalytics = (recipients) => {
  const recipientGenderCount = countByGender(recipients);
  const recipientBloodGroupCount = countByBloodGroup(recipients);

  renderRecipientBloodGroupChart(recipientBloodGroupCount);

  // Optional: render gender chart for recipients separately
  renderBarChart(
    'recipientGenderChart',
    ['Male', 'Female', 'Other'],
    [{
      label: 'Recipients',
      data: [recipientGenderCount.Male, recipientGenderCount.Female, recipientGenderCount.Other],
      backgroundColor: 'rgba(54, 162, 235, 0.7)'
    }],
    {
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Recipient Gender Distribution' }
      }
    }
  );
};


// =====================
// Main Dashboard Data Fetch & Render
// =====================

const renderDashboard = async () => {
  try {
    const [donors, recipients, donations, transfusions, requests] = await Promise.all([
      getDonors(),
      getRecipients(),
      getDonations(),
      getTransfusions(),
      getRequests()
    ]);

    // Update counters
    //updateCounters(donors, recipients, donations, transfusions);
    updateCounters(donors, recipients, donations, transfusions, requests);


    // Gender Distribution (combined donor + recipient)
    const donorGenderCount = countByGender(donors);
    const recipientGenderCount = countByGender(recipients);
    renderGenderChart(donorGenderCount, recipientGenderCount);

    // Blood Group Distribution (donors only)
    const donorBloodGroups = countByBloodGroup(donors);
    renderBloodGroupChart(donorBloodGroups);

    // Donation Blood Group Distribution
    const donationBloodGroups = countDonationsByBloodGroup(donations);
    renderDonationBloodGroupChart(donationBloodGroups);

    // Donation Heatmap
    const donationDates = donations.map(d => d.donationDate || d.date);
    renderSimpleCalendarHeatmap(donationDates, '#donationHeatmap');

    // Recent Donations List
    populateRecentDonations(donations, donors);

    // Expiring & Expired Donations
    const expiryData = filterExpiringAndExpired(donations);
    populateExpiringLists(expiryData, donors);

    // Average Donations Per Month
    const avgFreq = averageDonationsPerMonth(donations);
    displayAvgDonationFrequency(avgFreq);

    // New Analytics for Requests, Transfusions, Recipients
    renderRequestAnalytics(requests);
    renderTransfusionStats(transfusions);
    renderRecipientAnalytics(recipients);

  } catch (error) {
    console.error('Error rendering dashboard:', error);
  }
};

// Run on page load
document.addEventListener('DOMContentLoaded', renderDashboard);
