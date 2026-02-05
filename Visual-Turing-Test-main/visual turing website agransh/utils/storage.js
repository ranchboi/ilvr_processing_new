// Utility functions for saving and loading radiologist responses locally

export function saveRadiologistResponse(radiologistId, scanNumber, responseData) {
  try {
    // Get existing data or initialize
    const storageKey = 'radiologistResponses';
    let allResponses = JSON.parse(localStorage.getItem(storageKey) || '{}');
    
    // Initialize radiologist if doesn't exist
    if (!allResponses[radiologistId]) {
      allResponses[radiologistId] = [];
    }
    
    // Check if scan already exists, update it; otherwise add new
    const existingIndex = allResponses[radiologistId].findIndex(
      (r) => r.scanNumber === scanNumber
    );
    
    const responseEntry = {
      scanNumber,
      timestamp: new Date().toISOString(),
      ...responseData
    };
    
    if (existingIndex >= 0) {
      allResponses[radiologistId][existingIndex] = responseEntry;
    } else {
      allResponses[radiologistId].push(responseEntry);
    }
    
    // Save to localStorage
    localStorage.setItem(storageKey, JSON.stringify(allResponses));
    
    // Also save to a JSON file structure (for easier export)
    // We'll create a downloadable JSON file
    return true;
  } catch (error) {
    console.error('Error saving radiologist response:', error);
    return false;
  }
}

export function getAllRadiologistResponses() {
  try {
    const storageKey = 'radiologistResponses';
    return JSON.parse(localStorage.getItem(storageKey) || '{}');
  } catch (error) {
    console.error('Error loading radiologist responses:', error);
    return {};
  }
}

export function getRadiologistResponses(radiologistId) {
  try {
    const allResponses = getAllRadiologistResponses();
    return allResponses[radiologistId] || [];
  } catch (error) {
    console.error('Error loading radiologist responses:', error);
    return [];
  }
}

export function exportResponsesToJSON() {
  const allResponses = getAllRadiologistResponses();
  const dataStr = JSON.stringify(allResponses, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `radiologist-responses-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
