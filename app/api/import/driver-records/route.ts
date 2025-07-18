import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import SamsaraDriverRecordModel from '@/models/SamsaraDriverRecord';
import * as XLSX from 'xlsx';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Process the uploaded file
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Check file type - support both CSV and Excel
    const isCSV = file.name.endsWith('.csv');
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
    
    if (!isCSV && !isExcel) {
      return NextResponse.json(
        { error: 'Invalid file format. Please upload a CSV file (.csv) or Excel file (.xlsx or .xls)' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = await file.arrayBuffer();
    
    let data: any[];
    
    if (isCSV) {
      // Parse CSV file
      const text = new TextDecoder().decode(buffer);
      const workbook = XLSX.read(text, { type: 'string' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      data = XLSX.utils.sheet_to_json(worksheet);
    } else {
      // Parse Excel file
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      data = XLSX.utils.sheet_to_json(worksheet);
    }

    // Validate data structure
    if (data.length === 0) {
      return NextResponse.json(
        { error: 'Excel file does not contain any data' },
        { status: 400 }
      );
    }

    // Expected columns based on Samsara Excel format
    const requiredColumns = [
      'Rank', 'Driver Name', 'Driver Tags', 'Tag Paths', 'Driver ID', 'Username',
      'Safety Score', 'Drive Time (hh:mm:ss)', 'Total Distance (mi)', 'Total Events', 'Total Behaviors'
    ];

    // Expected speeding columns
    const speedingColumns = [
      'Time Over Speed Limit (hh:mm:ss) - Light', 'Time Over Speed Limit (hh:mm:ss) - Moderate',
      'Time Over Speed Limit (hh:mm:ss) - Heavy', 'Time Over Speed Limit (hh:mm:ss) - Severe',
      'Time Over Max Speed (hh:mm:ss)', 'Speeding (Manual)', 'Percent Light Speeding',
      'Percent Moderate Speeding', 'Percent Heavy Speeding', 'Percent Severe Speeding',
      'Percent Max Speed', 'Light Speeding Events Count', 'Moderate Speeding Events Count',
      'Heavy Speeding Events Count', 'Severe Speeding Events Count', 'Max Speed Events Count',
      'Max Speed (mph)', 'Max Speed At'
    ];

    // Expected event columns
    const eventColumns = [
      'Crash', 'Following Distance', 'Following of 0-2s (Manual)', 'Following of 2-4s (Manual)',
      'Late Response (Manual)', 'Defensive Driving (Manual)', 'Near Collision (Manual)',
      'Harsh Accel', 'Harsh Brake', 'Harsh Turn', 'Mobile Usage', 'Inattentive Driving',
      'Drowsy', 'Rolling Stop', 'Did Not Yield (Manual)', 'Ran Red Light (Manual)',
      'Lane Departure (Manual)', 'Obstructed Camera (Automatic)', 'Obstructed Camera (Manual)',
      'Eating/Drinking (Manual)', 'Smoking (Manual)', 'No Seat Belt', 'Forward Collision Warning'
    ];

    // Check if sample row has required columns
    const sampleRow = data[0] as any;
    const missingColumns = requiredColumns.filter(col => !(col in sampleRow));
    
    if (missingColumns.length > 0) {
      return NextResponse.json(
        { error: `Excel file is missing required columns: ${missingColumns.join(', ')}. Please ensure your Excel file matches the Samsara export format.` },
        { status: 400 }
      );
    }

    // Optional: Check for some key speeding columns (not all are required)
    const keySpeedingColumns = ['Max Speed (mph)', 'Safety Score'];
    const missingKeyColumns = keySpeedingColumns.filter(col => !(col in sampleRow));
    
    if (missingKeyColumns.length > 0) {
      console.warn(`Warning: Missing some optional columns: ${missingKeyColumns.join(', ')}`);
    }

    // Process and insert each row
    const result = {
      totalRows: data.length,
      imported: 0,
      updated: 0,
      errors: 0,
      errorDetails: [] as string[]
    };

    for (const row of data) {
      try {
        const rawData = row as any;
        
        // Map Samsara Excel columns to our database schema
        const driverData: any = {
          rank: rawData['Rank'] || 0,
          driverName: rawData['Driver Name'] || '',
          driverTags: rawData['Driver Tags'] || '',
          tagPaths: rawData['Tag Paths'] || '',
          driverId: rawData['Driver ID'] || '',
          username: rawData['Username'] || '',
          safetyScore: rawData['Safety Score'] || 0,
          driveTime: rawData['Drive Time (hh:mm:ss)'] || '00:00:00',
          totalDistance: rawData['Total Distance (mi)'] || 0,
          totalEvents: rawData['Total Events'] || 0,
          totalBehaviors: rawData['Total Behaviors'] || 0,
          weekStartDate: new Date(), // Default to current date, should be provided
          weekEndDate: new Date(),   // Default to current date, should be provided
        };

        // Extract speeding data
        const speedingData: any = {
          lightTime: rawData['Time Over Speed Limit (hh:mm:ss) - Light'] || '00:00:00',
          moderateTime: rawData['Time Over Speed Limit (hh:mm:ss) - Moderate'] || '00:00:00',
          heavyTime: rawData['Time Over Speed Limit (hh:mm:ss) - Heavy'] || '00:00:00',
          severeTime: rawData['Time Over Speed Limit (hh:mm:ss) - Severe'] || '00:00:00',
          maxSpeedTime: rawData['Time Over Max Speed (hh:mm:ss)'] || '00:00:00',
          manualCount: rawData['Speeding (Manual)'] || 0,
          percentLight: rawData['Percent Light Speeding'] || 0,
          percentModerate: rawData['Percent Moderate Speeding'] || 0,
          percentHeavy: rawData['Percent Heavy Speeding'] || 0,
          percentSevere: rawData['Percent Severe Speeding'] || 0,
          percentMax: rawData['Percent Max Speed'] || 0,
          lightCount: rawData['Light Speeding Events Count'] || 0,
          moderateCount: rawData['Moderate Speeding Events Count'] || 0,
          heavyCount: rawData['Heavy Speeding Events Count'] || 0,
          severeCount: rawData['Severe Speeding Events Count'] || 0,
          maxCount: rawData['Max Speed Events Count'] || 0,
          maxSpeed: rawData['Max Speed (mph)'] || 0,
          maxSpeedAt: rawData['Max Speed At'] ? new Date(rawData['Max Speed At']) : new Date(),
        };

        // Extract events data
        const events: any = {
          crash: rawData['Crash'] || 0,
          followingDistance: rawData['Following Distance'] || 0,
          following0to2s: rawData['Following of 0-2s (Manual)'] || 0,
          following2to4s: rawData['Following of 2-4s (Manual)'] || 0,
          lateResponse: rawData['Late Response (Manual)'] || 0,
          defensiveDriving: rawData['Defensive Driving (Manual)'] || 0,
          nearCollision: rawData['Near Collision (Manual)'] || 0,
          harshAccel: rawData['Harsh Accel'] || 0,
          harshBrake: rawData['Harsh Brake'] || 0,
          harshTurn: rawData['Harsh Turn'] || 0,
          mobileUsage: rawData['Mobile Usage'] || 0,
          inattentiveDriving: rawData['Inattentive Driving'] || 0,
          drowsy: rawData['Drowsy'] || 0,
          rollingStop: rawData['Rolling Stop'] || 0,
          didNotYield: rawData['Did Not Yield (Manual)'] || 0,
          ranRedLight: rawData['Ran Red Light (Manual)'] || 0,
          laneDeparture: rawData['Lane Departure (Manual)'] || 0,
          obstructedCameraAuto: rawData['Obstructed Camera (Automatic)'] || 0,
          obstructedCameraManual: rawData['Obstructed Camera (Manual)'] || 0,
          eatingDrinking: rawData['Eating/Drinking (Manual)'] || 0,
          smoking: rawData['Smoking (Manual)'] || 0,
          noSeatBelt: rawData['No Seat Belt'] || 0,
          forwardCollisionWarning: rawData['Forward Collision Warning'] || 0,
        };

        // Add nested data
        driverData.speedingData = speedingData;
        driverData.events = events;
        
        // Check for existing driver record
        const existingRecord = await SamsaraDriverRecordModel.findOne({ 
          driverId: driverData.driverId 
        });
        
        if (existingRecord) {
          // Update existing record
          await SamsaraDriverRecordModel.findByIdAndUpdate(existingRecord._id, driverData);
          result.updated++;
        } else {
          // Create new record
          await SamsaraDriverRecordModel.create(driverData);
          result.imported++;
        }
      } catch (error: any) {
        result.errors++;
        result.errorDetails.push(`Row ${result.imported + result.updated + result.errors}: ${error.message}`);
      }
    }

    return NextResponse.json({ 
      message: `Import completed. ${result.imported} records imported, ${result.updated} records updated, ${result.errors} errors.`,
      result 
    });
  } catch (error: any) {
    console.error('Error importing driver records:', error);
    return NextResponse.json(
      { error: `Failed to import driver records: ${error.message}` },
      { status: 500 }
    );
  }
}
