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
        
        // Helper function to safely convert to number
        const safeNumber = (value: any, defaultValue: number = 0): number => {
          if (value === null || value === undefined || value === '') return defaultValue;
          const num = Number(value);
          return isNaN(num) ? defaultValue : num;
        };

        // Helper function to safely convert to string
        const safeString = (value: any, defaultValue: string = ''): string => {
          if (value === null || value === undefined) return defaultValue;
          return String(value);
        };

        // Helper function to parse time strings (hh:mm:ss format)
        const safeTimeString = (value: any): string => {
          if (!value) return '00:00:00';
          const timeStr = String(value);
          // Check if it's already in hh:mm:ss format
          if (/^\d{1,3}:\d{2}:\d{2}$/.test(timeStr)) return timeStr;
          // If it's a decimal (like 0.11), convert to time format
          if (!isNaN(Number(timeStr))) {
            const hours = Math.floor(Number(timeStr));
            const minutes = Math.floor((Number(timeStr) - hours) * 60);
            const seconds = Math.floor(((Number(timeStr) - hours) * 60 - minutes) * 60);
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          }
          return '00:00:00';
        };

        // Helper function to parse date strings
        const safeDate = (value: any): Date => {
          if (!value) return new Date();
          try {
            // Handle different date formats
            if (typeof value === 'string') {
              // Handle formats like "Jan 6 10:38AM PST"
              const parsed = new Date(value);
              return isNaN(parsed.getTime()) ? new Date() : parsed;
            }
            return new Date(value);
          } catch {
            return new Date();
          }
        };

        // Map Samsara Excel columns to our database schema with robust data handling
        const driverData: any = {
          rank: safeNumber(rawData['Rank']),
          driverName: safeString(rawData['Driver Name'], 'Unknown Driver'),
          driverTags: safeString(rawData['Driver Tags']),
          tagPaths: safeString(rawData['Tag Paths']),
          driverId: safeString(rawData['Driver ID']),
          username: safeString(rawData['Username']),
          safetyScore: safeNumber(rawData['Safety Score']),
          driveTime: safeTimeString(rawData['Drive Time (hh:mm:ss)']),
          totalDistance: safeNumber(rawData['Total Distance (mi)']),
          totalEvents: safeNumber(rawData['Total Events']),
          totalBehaviors: safeNumber(rawData['Total Behaviors']),
          weekStartDate: new Date(), // Default to current date, should be provided
          weekEndDate: new Date(),   // Default to current date, should be provided
        };

        // Extract speeding data with robust handling
        const speedingData: any = {
          lightTime: safeTimeString(rawData['Time Over Speed Limit (hh:mm:ss) - Light']),
          moderateTime: safeTimeString(rawData['Time Over Speed Limit (hh:mm:ss) - Moderate']),
          heavyTime: safeTimeString(rawData['Time Over Speed Limit (hh:mm:ss) - Heavy']),
          severeTime: safeTimeString(rawData['Time Over Speed Limit (hh:mm:ss) - Severe']),
          maxSpeedTime: safeTimeString(rawData['Time Over Max Speed (hh:mm:ss)']),
          manualCount: safeNumber(rawData['Speeding (Manual)']),
          percentLight: safeNumber(rawData['Percent Light Speeding']),
          percentModerate: safeNumber(rawData['Percent Moderate Speeding']),
          percentHeavy: safeNumber(rawData['Percent Heavy Speeding']),
          percentSevere: safeNumber(rawData['Percent Severe Speeding']),
          percentMax: safeNumber(rawData['Percent Max Speed']),
          lightCount: safeNumber(rawData['Light Speeding Events Count']),
          moderateCount: safeNumber(rawData['Moderate Speeding Events Count']),
          heavyCount: safeNumber(rawData['Heavy Speeding Events Count']),
          severeCount: safeNumber(rawData['Severe Speeding Events Count']),
          maxCount: safeNumber(rawData['Max Speed Events Count']),
          maxSpeed: safeNumber(rawData['Max Speed (mph)']),
          maxSpeedAt: safeDate(rawData['Max Speed At']),
        };

        // Extract events data with robust handling
        const events: any = {
          crash: safeNumber(rawData['Crash']),
          followingDistance: safeNumber(rawData['Following Distance']),
          following0to2s: safeNumber(rawData['Following of 0-2s (Manual)']),
          following2to4s: safeNumber(rawData['Following of 2-4s (Manual)']),
          lateResponse: safeNumber(rawData['Late Response (Manual)']),
          defensiveDriving: safeNumber(rawData['Defensive Driving (Manual)']),
          nearCollision: safeNumber(rawData['Near Collision (Manual)']),
          harshAccel: safeNumber(rawData['Harsh Accel']),
          harshBrake: safeNumber(rawData['Harsh Brake']),
          harshTurn: safeNumber(rawData['Harsh Turn']),
          mobileUsage: safeNumber(rawData['Mobile Usage']),
          inattentiveDriving: safeNumber(rawData['Inattentive Driving']),
          drowsy: safeNumber(rawData['Drowsy']),
          rollingStop: safeNumber(rawData['Rolling Stop']),
          didNotYield: safeNumber(rawData['Did Not Yield (Manual)']),
          ranRedLight: safeNumber(rawData['Ran Red Light (Manual)']),
          laneDeparture: safeNumber(rawData['Lane Departure (Manual)']),
          obstructedCameraAuto: safeNumber(rawData['Obstructed Camera (Automatic)']),
          obstructedCameraManual: safeNumber(rawData['Obstructed Camera (Manual)']),
          eatingDrinking: safeNumber(rawData['Eating/Drinking (Manual)']),
          smoking: safeNumber(rawData['Smoking (Manual)']),
          noSeatBelt: safeNumber(rawData['No Seat Belt']),
          forwardCollisionWarning: safeNumber(rawData['Forward Collision Warning']),
        };

        // Add nested data
        driverData.speedingData = speedingData;
        driverData.events = events;
        
        // Validate required fields
        if (!driverData.driverName || driverData.driverName === 'Unknown Driver') {
          throw new Error('Missing required field: Driver Name');
        }
        
        if (!driverData.driverId) {
          throw new Error('Missing required field: Driver ID');
        }
        
        // Check for existing driver record (use combination of driverId and driverName for uniqueness)
        const existingRecord = await SamsaraDriverRecordModel.findOne({ 
          $or: [
            { driverId: driverData.driverId },
            { driverName: driverData.driverName, driverId: driverData.driverId }
          ]
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
