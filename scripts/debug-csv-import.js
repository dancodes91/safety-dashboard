const XLSX = require('xlsx');
const fs = require('fs');

// Read the CSV file
const csvPath = '../06-12-25 KPA data Dump for dashboard.csv';
const csvContent = fs.readFileSync(csvPath, 'utf8');

// Parse CSV
const workbook = XLSX.read(csvContent, { type: 'string' });
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

console.log('Total rows:', data.length);
console.log('First row keys:', Object.keys(data[0]));
console.log('First row data:', JSON.stringify(data[0], null, 2));

// Check each row for potential issues
data.forEach((row, index) => {
  console.log(`\n--- Row ${index + 1} ---`);
  console.log('Report #:', row['Report #']);
  console.log('Employee:', row['Employee:']);
  console.log('Date & Time:', row['Date & Time of Accident/Incident:']);
  console.log('Date type:', typeof row['Date & Time of Accident/Incident:']);
  
  // Try to parse the date
  const dateStr = row['Date & Time of Accident/Incident:'];
  if (dateStr) {
    try {
      const parsedDate = new Date(dateStr);
      console.log('Parsed date:', parsedDate);
      console.log('Is valid date:', !isNaN(parsedDate.getTime()));
    } catch (error) {
      console.log('Date parsing error:', error.message);
    }
  }
});
