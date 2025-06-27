#!/usr/bin/env node

/**
 * Database initialization script for Safety Dashboard
 * 
 * This script initializes the MongoDB database with initial data:
 * - Creates an admin user
 * - Sets up KPI goals with default thresholds
 * - Adds sample data if requested
 * 
 * Usage: npm run init-db [-- --with-sample-data]
 */

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const readline = require('readline');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/safety_dashboard';
const withSampleData = process.argv.includes('--with-sample-data');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function initializeDatabase() {
  console.log('🔧 Initializing Safety Dashboard database...');
  
  let client;
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    
    // Create admin user
    const usersCollection = db.collection('users');
    const adminExists = await usersCollection.findOne({ email: 'admin@example.com' });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('SafetyFirst!123', 10);
      await usersCollection.insertOne({
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('✅ Created admin user (admin@example.com / SafetyFirst!123)');
    } else {
      console.log('ℹ️ Admin user already exists');
    }
    
    // Create default KPI goals
    const kpiGoalsCollection = db.collection('kpigoals');
    
    const defaultKpiGoals = [
      {
        metricName: 'Incident Rate',
        description: 'Number of recordable incidents per 100 employees',
        category: 'Safety',
        targetValue: 0,
        redThreshold: 5,
        yellowThreshold: 2,
        unit: 'incidents',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        metricName: 'Driver Safety Score',
        description: 'Average safety score for fleet drivers',
        category: 'Driver Safety',
        targetValue: 100,
        redThreshold: 70,
        yellowThreshold: 85,
        unit: 'score',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        metricName: 'Compliance Rate',
        description: 'Percentage of regulatory requirements met',
        category: 'Compliance',
        targetValue: 100,
        redThreshold: 80,
        yellowThreshold: 95,
        unit: '%',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        metricName: 'Training Completion',
        description: 'Percentage of required training completed',
        category: 'Training',
        targetValue: 100,
        redThreshold: 75,
        yellowThreshold: 90,
        unit: '%',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    const kpiGoalsCount = await kpiGoalsCollection.countDocuments({});
    if (kpiGoalsCount === 0) {
      await kpiGoalsCollection.insertMany(defaultKpiGoals);
      console.log('✅ Created default KPI goals');
    } else {
      console.log('ℹ️ KPI goals already exist');
    }
    
    if (withSampleData) {
      await createSampleData(db);
    }
    
    console.log('🎉 Database initialization complete!');
    console.log('\nYou can now start the application with:');
    console.log('  npm run dev');
    console.log('\nLogin with:');
    console.log('  Email: admin@example.com');
    console.log('  Password: SafetyFirst!123');
    console.log('\n⚠️  Remember to change the default password after first login!');
    
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
    }
    rl.close();
  }
}

async function createSampleData(db) {
  console.log('📊 Creating sample data...');
  
  // Create sample KPA events
  const kpaEventsCollection = db.collection('kpaevents');
  const eventsCount = await kpaEventsCollection.countDocuments({});
  
  if (eventsCount === 0) {
    const sampleEvents = generateSampleKpaEvents(20);
    await kpaEventsCollection.insertMany(sampleEvents);
    console.log('✅ Created sample KPA events');
  } else {
    console.log('ℹ️ KPA events already exist');
  }
  
  // Create sample driver records
  const driverRecordsCollection = db.collection('samsaradriverrecords');
  const driversCount = await driverRecordsCollection.countDocuments({});
  
  if (driversCount === 0) {
    const sampleDrivers = generateSampleDriverRecords(15);
    await driverRecordsCollection.insertMany(sampleDrivers);
    console.log('✅ Created sample driver records');
  } else {
    console.log('ℹ️ Driver records already exist');
  }
  
  // Create sample training records
  const trainingRecordsCollection = db.collection('trainingrecords');
  const trainingCount = await trainingRecordsCollection.countDocuments({});
  
  if (trainingCount === 0) {
    const sampleTraining = generateSampleTrainingRecords(30);
    await trainingRecordsCollection.insertMany(sampleTraining);
    console.log('✅ Created sample training records');
  } else {
    console.log('ℹ️ Training records already exist');
  }
}

function generateSampleKpaEvents(count) {
  const eventTypes = ['Near Miss', 'First Aid', 'Medical Treatment', 'Lost Time', 'Property Damage'];
  const locations = ['Warehouse', 'Office', 'Loading Dock', 'Parking Lot', 'Customer Site', 'Roadway'];
  const departments = ['Operations', 'Maintenance', 'Safety', 'Administration', 'Logistics'];
  const observers = ['John Smith', 'Mary Johnson', 'Robert Garcia', 'Sarah Williams', 'Michael Brown'];
  
  const events = [];
  
  for (let i = 1; i <= count; i++) {
    const reportDate = randomDate(new Date(2023, 0, 1), new Date());
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const severity = Math.floor(Math.random() * 5) + 1;
    
    events.push({
      reportNumber: `INC-${String(i).padStart(4, '0')}`,
      reportDate,
      observer: observers[Math.floor(Math.random() * observers.length)],
      employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      employeeName: generateRandomName(),
      department: departments[Math.floor(Math.random() * departments.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      eventType,
      description: `Sample ${eventType.toLowerCase()} incident that occurred during normal operations.`,
      severity,
      severityText: getSeverityText(severity),
      rootCause: getRandomRootCause(),
      correctiveActions: getRandomCorrectiveAction(),
      status: Math.random() > 0.7 ? 'Open' : 'Closed',
      closedDate: Math.random() > 0.7 ? null : randomDate(reportDate, new Date()),
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
  
  return events;
}

function generateSampleDriverRecords(count) {
  const departments = ['Operations', 'Maintenance', 'Safety', 'Logistics'];
  const vehicleTypes = ['Truck', 'Van', 'Car', 'Heavy Equipment'];
  
  const records = [];
  
  for (let i = 1; i <= count; i++) {
    const reportDate = randomDate(new Date(2023, 0, 1), new Date());
    const safetyScore = Math.floor(Math.random() * 31) + 70; // 70-100
    
    records.push({
      driverId: `DRIVER-${String(i).padStart(4, '0')}`,
      employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      employeeName: generateRandomName(),
      department: departments[Math.floor(Math.random() * departments.length)],
      vehicleId: `VEH-${Math.floor(1000 + Math.random() * 9000)}`,
      vehicleType: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
      reportDate,
      safetyScore,
      milesDriven: Math.floor(Math.random() * 5000) + 1000,
      speedingData: {
        lightTime: `${Math.floor(Math.random() * 60)}m`,
        moderateTime: `${Math.floor(Math.random() * 30)}m`,
        severeTime: `${Math.floor(Math.random() * 10)}m`,
        speedingEvents: Math.floor(Math.random() * 10)
      },
      driverEvents: {
        harshAcceleration: Math.floor(Math.random() * 5),
        harshBraking: Math.floor(Math.random() * 5),
        harshTurns: Math.floor(Math.random() * 3),
        distracted: Math.floor(Math.random() * 2)
      },
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
  
  return records;
}

function generateSampleTrainingRecords(count) {
  const departments = ['Operations', 'Maintenance', 'Safety', 'HR', 'Administration', 'Logistics'];
  const trainingTypes = ['Safety Training', 'Compliance', 'Technical Skills', 'Soft Skills', 'Leadership'];
  const trainingNames = [
    'Defensive Driving',
    'Hazardous Materials Handling',
    'First Aid and CPR',
    'Forklift Operation',
    'Electrical Safety',
    'Fire Safety',
    'Fall Protection',
    'HR Compliance',
    'Data Privacy and Security',
    'Safety Leadership'
  ];
  const statuses = ['Completed', 'In Progress', 'Not Started', 'Expired', 'Overdue'];
  
  const records = [];
  
  for (let i = 1; i <= count; i++) {
    const employeeId = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
    const employeeName = generateRandomName();
    const department = departments[Math.floor(Math.random() * departments.length)];
    const trainingType = trainingTypes[Math.floor(Math.random() * trainingTypes.length)];
    const trainingName = trainingNames[Math.floor(Math.random() * trainingNames.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    let completionDate = null;
    let expirationDate = null;
    let score = null;
    
    if (status === 'Completed') {
      completionDate = randomDate(new Date(2022, 0, 1), new Date());
      expirationDate = new Date(completionDate);
      expirationDate.setFullYear(expirationDate.getFullYear() + 1);
      score = Math.floor(Math.random() * 21) + 80; // 80-100
    } else if (status === 'Expired') {
      completionDate = randomDate(new Date(2021, 0, 1), new Date(2022, 0, 1));
      expirationDate = new Date(completionDate);
      expirationDate.setFullYear(expirationDate.getFullYear() + 1);
      score = Math.floor(Math.random() * 21) + 80; // 80-100
    } else if (status === 'Overdue') {
      completionDate = null;
      expirationDate = randomDate(new Date(2022, 0, 1), new Date(2023, 0, 1));
      score = null;
    }
    
    records.push({
      id: `TR-${String(i).padStart(3, '0')}`,
      employeeId,
      employeeName,
      department,
      trainingType,
      trainingName,
      status,
      completionDate: completionDate ? formatDate(completionDate) : null,
      expirationDate: expirationDate ? formatDate(expirationDate) : null,
      score,
      requiredBy: Math.random() > 0.5 ? 'Company Policy' : 'Regulatory Requirement',
      assignedBy: generateRandomName(),
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
  
  return records;
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function generateRandomName() {
  const firstNames = ['John', 'Mary', 'Robert', 'Sarah', 'Michael', 'Jennifer', 'William', 'Elizabeth', 'David', 'Patricia', 'Richard', 'Linda', 'Joseph', 'Barbara', 'Thomas', 'Susan'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin'];
  
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
}

function getSeverityText(severity) {
  switch (severity) {
    case 1: return 'Negligible';
    case 2: return 'Minor';
    case 3: return 'Moderate';
    case 4: return 'Significant';
    case 5: return 'Severe';
    default: return 'Unknown';
  }
}

function getRandomRootCause() {
  const rootCauses = [
    'Inadequate training',
    'Procedural error',
    'Equipment failure',
    'Environmental factor',
    'Human error',
    'Communication breakdown',
    'Inadequate risk assessment',
    'Time pressure',
    'Lack of proper PPE',
    'Poor housekeeping'
  ];
  
  return rootCauses[Math.floor(Math.random() * rootCauses.length)];
}

function getRandomCorrectiveAction() {
  const actions = [
    'Provide additional training',
    'Update procedure documentation',
    'Repair/replace equipment',
    'Implement environmental controls',
    'Update risk assessment process',
    'Improve communication protocols',
    'Provide appropriate PPE',
    'Implement regular inspections',
    'Review and update safety policies',
    'Install additional safeguards'
  ];
  
  return actions[Math.floor(Math.random() * actions.length)];
}

// Run the initialization
initializeDatabase().catch(console.error);