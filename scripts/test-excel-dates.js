// Test Excel date conversion
function convertExcelDate(excelDate) {
  // Excel stores dates as serial numbers starting from 1900-01-01
  // Excel has a bug where it treats 1900 as a leap year, so we need to subtract 1
  const excelEpoch = new Date(1900, 0, 1);
  const days = excelDate - 1; // Subtract 1 for Excel's leap year bug
  return new Date(excelEpoch.getTime() + days * 24 * 60 * 60 * 1000);
}

// Test with the actual values from the CSV
console.log('Testing Excel date conversion:');
console.log('Excel date 44106 (hire date) =>', convertExcelDate(44106));
console.log('Excel date 45819.40625 (incident date) =>', convertExcelDate(45819.40625));
console.log('Excel date 45818.5 =>', convertExcelDate(45818.5));
console.log('Excel date 45818.43263888889 =>', convertExcelDate(45818.43263888889));

// Expected dates based on CSV content:
// 10/2/2020 for hire date
// 6/11/2025 9:45 for incident date
// 6/10/2025 12:00 for another incident
// 6/10/2025 10:23 for another incident
