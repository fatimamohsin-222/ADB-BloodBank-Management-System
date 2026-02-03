// =====================
// API Base URL
// =====================
const API_BASE_URL = 'http://localhost:5000/api';

// =====================
// Donor APIs
// =====================
export const getDonors = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/donors`);
    const data = await response.json();
    return data.donors;
  } catch (error) {
    console.error('Error fetching donors:', error);
    return [];
  }
};

export const getDonorMapData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/donors/map`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching map data:', error);
    return [];
  }
};

// =====================
// Donation APIs
// =====================
export const getDonations = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/donations`);
    const data = await response.json();
    return data.donations;
  } catch (error) {
    console.error('Error fetching donations:', error);
    return [];
  }
};

// =====================
// Recipient APIs
// =====================
export const getRecipients = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipients`);
    const data = await response.json();
    return data.recipients;
  } catch (error) {
    console.error('Error fetching recipients:', error);
    return [];
  }
};

export const getRecipientStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipients/stats`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching recipient stats:', error);
    return null;
  }
};

export const getTopRequestedBloodGroups = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipients/top-groups`);
    const data = await response.json();
    return data.topGroups;
  } catch (error) {
    console.error('Error fetching top blood groups:', error);
    return [];
  }
};

// =====================
// Request APIs
// =====================
export const getRequests = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/requests`);
    const data = await response.json();
    return data.requests;
  } catch (error) {
    console.error('Error fetching requests:', error);
    return [];
  }
};

export const getRequestStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/requests/stats`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching request stats:', error);
    return null;
  }
};

export const getPendingRequests = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/requests/pending`);
    const data = await response.json();
    return data.pendingRequests;
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    return [];
  }
};

export const getShortageAlerts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/requests/shortage-alerts`);
    const data = await response.json();
    return data.shortages;
  } catch (error) {
    console.error('Error fetching shortage alerts:', error);
    return [];
  }
};


// =====================
// Transfusion APIs
// =====================
export const getTransfusions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/transfusions`);
    const data = await response.json();
    return data.transfusions;
  } catch (error) {
    console.error('Error fetching transfusions:', error);
    return [];
  }
};

export const getTransfusionStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/transfusions/stats`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching transfusion stats:', error);
    return null;
  }
};

// Compatibility + Expiry Check + Save Transfusion
export const validateAndSaveTransfusion = async (transfusionData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/transfusions/checks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transfusionData)
    });
    const data = await response.json();
    return data.transfusion;
  } catch (error) {
    console.error('Error validating transfusion:', error);
    return null;
  }
};
