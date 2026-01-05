// Helper function to normalize email (lowercase, trim)
function normalizeEmail(email) {
  return email ? email.toLowerCase().trim() : '';
}

// Helper function to get next sequential task ID for a user/date
function getNextTaskId(tasksForDate) {
  if (!tasksForDate || tasksForDate.length === 0) {
    return '1';
  }
  
  // Get all numeric IDs (filter out temp IDs and non-numeric)
  const numericIds = tasksForDate
    .map(t => {
      const numId = parseInt(t.id, 10);
      return isNaN(numId) ? 0 : numId;
    })
    .filter(id => id > 0);
  
  if (numericIds.length === 0) {
    return '1';
  }
  
  // Return the next ID (max + 1)
  const maxId = Math.max(...numericIds);
  return (maxId + 1).toString();
}

module.exports = {
  normalizeEmail,
  getNextTaskId,
};

