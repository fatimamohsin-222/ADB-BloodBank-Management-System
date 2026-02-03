// chart.js

// =====================
// Global Chart Instances
// =====================
const chartInstances = {};

// =====================
// Render Bar Chart
// =====================
export const renderBarChart = (canvasId, labels, datasets, options = {}) => {
  if (chartInstances[canvasId]) chartInstances[canvasId].destroy();

  const ctx = document.getElementById(canvasId).getContext('2d');
  chartInstances[canvasId] = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      ...options
    }
  });
};

// =====================
// Render Pie Chart
// =====================
export const renderPieChart = (canvasId, labels, data, backgroundColors, options = {}) => {
  if (chartInstances[canvasId]) chartInstances[canvasId].destroy();

  const ctx = document.getElementById(canvasId).getContext('2d');
  chartInstances[canvasId] = new Chart(ctx, {
    type: 'pie',
    data: {
      labels,
      datasets: [{ data, backgroundColor: backgroundColors }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      ...options
    }
  });
};

// =====================
// Render Donation Blood Group Chart (wrapper)
// =====================
export const renderDonationBloodGroupChart = (donationCounts) => {
  renderPieChart(
    'donationBloodGroupChart',
    Object.keys(donationCounts),
    Object.values(donationCounts),
    [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
      '#9966FF', '#FF9F40', '#66FF66', '#FF6666'
    ],
    {
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Donation Blood Group Distribution' }
      }
    }
  );
};

// =====================
// Render Donation Heatmap
// =====================
let donationHeatmapInstance = null;
export const renderDonationHeatmap = (donationDates, selector = '#donationHeatmap') => {
  // Convert dates to timestamps counts for CalHeatmap
  const dateCounts = donationDates.reduce((acc, dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date)) return acc; // skip invalid dates
    const timestamp = Math.floor(date.getTime() / 1000); // seconds timestamp
    acc[timestamp] = (acc[timestamp] || 0) + 1;
    return acc;
  }, {});

  // Destroy previous if exists
  if (donationHeatmapInstance) {
    donationHeatmapInstance.destroy();
  }
 
};


// =====================
// Render Gender Chart (bar chart wrapper)
// =====================
export const renderGenderChart = (donorGenderCount, recipientGenderCount) => {
  renderBarChart(
    'genderChart',
    ['Male', 'Female', 'Other'],
    [
      {
        label: 'Donors',
        data: [donorGenderCount.Male, donorGenderCount.Female, donorGenderCount.Other],
        backgroundColor: 'rgba(54, 162, 235, 0.7)'
      },
      {
        label: 'Recipients',
        data: [recipientGenderCount.Male, recipientGenderCount.Female, recipientGenderCount.Other],
        backgroundColor: 'rgba(255, 99, 132, 0.7)'
      }
    ],
    {
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Gender Distribution of Donors & Recipients' }
      }
    }
  );
};

// =====================
// Render Blood Group Chart (pie chart wrapper)
// =====================
export const renderBloodGroupChart = (bloodGroupCounts) => {
  renderPieChart(
    'bloodGroupChart',
    Object.keys(bloodGroupCounts),
    Object.values(bloodGroupCounts),
    [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
      '#9966FF', '#FF9F40', '#66FF66', '#FF6666'
    ],
    {
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Blood Group Distribution Among Donors' }
      }
    }
  );
};

export const renderRecipientBloodGroupChart = (bloodGroupCounts) => {
  renderPieChart(
    'recipientBloodGroupChart',
    Object.keys(bloodGroupCounts),
    Object.values(bloodGroupCounts),
    [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
      '#9966FF', '#FF9F40', '#66FF66', '#FF6666'
    ],
    {
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Blood Group Distribution Among Recipients' }
      }
    }
  );
};

export const renderRequestStatusChart = (statusCounts) => {
  renderPieChart(
    'requestStatusChart',
    Object.keys(statusCounts),
    Object.values(statusCounts),
    [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
      '#9966FF', '#FF9F40'
    ],
    {
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Request Status Distribution' }
      }
    }
  );
};

export const renderTransfusionChart = (success, failure) => {
  renderPieChart(
    'transfusionChart',
    ['Successful', 'Failed'], // ✅ match labels with backend data
    [success, failure],
    ['#28a745', '#dc3545'],
    {
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Transfusion: Successful vs Failed' }
      }
    }
  );
};
