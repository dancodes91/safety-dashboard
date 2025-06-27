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

    // Check file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json(
        { error: 'Invalid file format. Please upload an Excel file (.xlsx or .xls)' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = await file.arrayBuffer();
    
    // Parse Excel file
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Validate data structure
    if (data.length === 0) {
      return NextResponse.json(
        { error: 'Excel file does not contain any data' },
        { status: 400 }
      );
    }

    // Expected columns for main driver data
    const requiredColumns = [
      'driverId', 'driverName', 'division', 'homePlant', 
      'hireDate', 'supervisor', 'safetyScore', 'previousSafetyScore',
      'safetyScoreDelta', 'driveTime', 'totalMiles', 
      'alertCount', 'warningCount', 'criticalCount', 
      'vehicleInspectionCount', 'coachingSessionsCompleted',
      'coachingSessionsRequired', 'lastRecordedDate'
    ];

    // Expected columns for speeding data
    const speedingColumns = [
      'lightTime', 'moderateTime', 'heavyTime', 'totalTime',
      'averageSpeed', 'maxSpeed', 'speedLimit', 'countOverSpeed',
      'percentageOverSpeed'
    ];

    // Check if sample row has required columns
    const sampleRow = data[0] as any;
    const missingColumns = requiredColumns.filter(col => !(col in sampleRow));
    
    // Check for speeding data fields
    const missingSpeedingColumns = speedingColumns.filter(col => {
      const speedingKey = `speeding_${col}`;
      return !(speedingKey in sampleRow);
    });
    
    if (missingColumns.length > 0) {
      return NextResponse.json(
        { error: `Excel file is missing required columns: ${missingColumns.join(', ')}` },
        { status: 400 }
      );
    }
    
    if (missingSpeedingColumns.length > 0) {
      return NextResponse.json(
        { error: `Excel file is missing required speeding data columns: ${missingSpeedingColumns.map(c => `speeding_${c}`).join(', ')}` },
        { status: 400 }
      );
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
        const driverData = { ...row } as any;
        
        // Format date fields
        if (driverData.hireDate) {
          if (typeof driverData.hireDate === 'string') {
            driverData.hireDate = new Date(driverData.hireDate);
          } else if (typeof driverData.hireDate === 'number') {
            driverData.hireDate = XLSX.SSF.parse_date_code(driverData.hireDate);
          }
        }
        
        if (driverData.lastRecordedDate) {
          if (typeof driverData.lastRecordedDate === 'string') {
            driverData.lastRecordedDate = new Date(driverData.lastRecordedDate);
          } else if (typeof driverData.lastRecordedDate === 'number') {
            driverData.lastRecordedDate = XLSX.SSF.parse_date_code(driverData.lastRecordedDate);
          }
        }
        
        if (driverData.lastCoachedDate) {
          if (typeof driverData.lastCoachedDate === 'string') {
            driverData.lastCoachedDate = new Date(driverData.lastCoachedDate);
          } else if (typeof driverData.lastCoachedDate === 'number') {
            driverData.lastCoachedDate = XLSX.SSF.parse_date_code(driverData.lastCoachedDate);
          }
        }
        
        // Extract speeding data
        const speedingData: any = {};
        for (const col of speedingColumns) {
          const speedingKey = `speeding_${col}`;
          speedingData[col] = driverData[speedingKey];
          // Remove the speeding_ prefix fields
          delete driverData[speedingKey];
        }
        
        // Add speeding data to the driver record
        driverData.speedingData = speedingData;
        
        // Extract events data if available
        if (driverData.events && typeof driverData.events === 'string') {
          try {
            driverData.events = JSON.parse(driverData.events);
          } catch (e) {
            // If events cannot be parsed, set to empty array
            driverData.events = [];
          }
        } else if (!driverData.events) {
          driverData.events = [];
        }
        
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