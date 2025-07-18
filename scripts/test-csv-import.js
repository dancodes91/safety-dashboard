/**
 * Test script to verify CSV import functionality
 * This script can be used to test the import endpoints with sample data
 */

const fs = require('fs');
const path = require('path');

// Test data paths
const KPA_CSV_PATH = path.join(__dirname, '..', '06-12-25 KPA data Dump for dashboard.csv');
const SAMSARA_CSV_PATH = path.join(__dirname, '..', '(Samsara)_Driver_Safety_Report_by_Driver_-_Holliday_Rock_-_Jan_01_2025_-_Jun_19_2025.csv');

/**
 * Test KPA CSV import endpoint
 */
async function testKpaImport() {
  console.log('🧪 Testing KPA CSV Import...');
  
  try {
    // Check if CSV file exists
    if (!fs.existsSync(KPA_CSV_PATH)) {
      console.log('❌ KPA CSV file not found at:', KPA_CSV_PATH);
      return;
    }

    // Read CSV file
    const csvData = fs.readFileSync(KPA_CSV_PATH);
    
    // Create FormData
    const formData = new FormData();
    const blob = new Blob([csvData], { type: 'text/csv' });
    formData.append('file', blob, '06-12-25 KPA data Dump for dashboard.csv');

    // Make API request
    const response = await fetch('http://localhost:3000/api/import/kpa-events', {
      method: 'POST',
      body: formData,
      headers: {
        // Add authentication headers if needed
        // 'Authorization': 'Bearer your-token-here'
      }
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ KPA Import successful:', result.message);
      console.log('📊 Import stats:', result.result);
    } else {
      console.log('❌ KPA Import failed:', result.error);
    }
  } catch (error) {
    console.log('❌ KPA Import error:', error.message);
  }
}

/**
 * Test Samsara CSV import endpoint
 */
async function testSamsaraImport() {
  console.log('🧪 Testing Samsara CSV Import...');
  
  try {
    // Check if CSV file exists
    if (!fs.existsSync(SAMSARA_CSV_PATH)) {
      console.log('❌ Samsara CSV file not found at:', SAMSARA_CSV_PATH);
      return;
    }

    // Read CSV file
    const csvData = fs.readFileSync(SAMSARA_CSV_PATH);
    
    // Create FormData
    const formData = new FormData();
    const blob = new Blob([csvData], { type: 'text/csv' });
    formData.append('file', blob, '(Samsara)_Driver_Safety_Report_by_Driver_-_Holliday_Rock_-_Jan_01_2025_-_Jun_19_2025.csv');

    // Make API request
    const response = await fetch('http://localhost:3000/api/import/driver-records', {
      method: 'POST',
      body: formData,
      headers: {
        // Add authentication headers if needed
        // 'Authorization': 'Bearer your-token-here'
      }
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Samsara Import successful:', result.message);
      console.log('📊 Import stats:', result.result);
    } else {
      console.log('❌ Samsara Import failed:', result.error);
    }
  } catch (error) {
    console.log('❌ Samsara Import error:', error.message);
  }
}

/**
 * Test data retrieval endpoints
 */
async function testDataRetrieval() {
  console.log('🧪 Testing Data Retrieval...');
  
  try {
    // Test KPA events endpoint
    const kpaResponse = await fetch('http://localhost:3000/api/kpa-events?limit=5');
    const kpaData = await kpaResponse.json();
    
    if (kpaResponse.ok) {
      console.log('✅ KPA Events retrieval successful');
      console.log('📊 Sample KPA events:', kpaData.events?.length || 0, 'records');
    } else {
      console.log('❌ KPA Events retrieval failed:', kpaData.error);
    }

    // Test driver records endpoint
    const driverResponse = await fetch('http://localhost:3000/api/driver-records?limit=5');
    const driverData = await driverResponse.json();
    
    if (driverResponse.ok) {
      console.log('✅ Driver Records retrieval successful');
      console.log('📊 Sample driver records:', driverData.records?.length || 0, 'records');
    } else {
      console.log('❌ Driver Records retrieval failed:', driverData.error);
    }

    // Test statistics endpoints
    const kpaStatsResponse = await fetch('http://localhost:3000/api/kpa-events/stats');
    const kpaStats = await kpaStatsResponse.json();
    
    if (kpaStatsResponse.ok) {
      console.log('✅ KPA Statistics retrieval successful');
      console.log('📊 KPA Stats:', kpaStats);
    } else {
      console.log('❌ KPA Statistics retrieval failed:', kpaStats.error);
    }

  } catch (error) {
    console.log('❌ Data retrieval error:', error.message);
  }
}

/**
 * Main test function
 */
async function runTests() {
  console.log('🚀 Starting CSV Import Tests...\n');
  
  // Check if server is running
  try {
    const healthCheck = await fetch('http://localhost:3000/api/health');
    if (!healthCheck.ok) {
      console.log('❌ Server is not running. Please start the development server with: npm run dev');
      return;
    }
  } catch (error) {
    console.log('❌ Cannot connect to server. Please ensure the development server is running on http://localhost:3000');
    return;
  }

  console.log('✅ Server is running\n');

  // Run import tests
  await testKpaImport();
  console.log('');
  await testSamsaraImport();
  console.log('');
  
  // Wait a moment for data to be processed
  console.log('⏳ Waiting for data processing...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log('');
  
  // Test data retrieval
  await testDataRetrieval();
  
  console.log('\n🎉 Tests completed!');
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  testKpaImport,
  testSamsaraImport,
  testDataRetrieval,
  runTests
};
