import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import KpaEventModel from '@/models/KpaEvent';
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

    // Expected columns based on actual KPA CSV format
    const requiredColumns = [
      'Report #', 'Observer', 'Employee:', 'Division:', 'Home Plant:',
      'Employee: - Hire Date', 'Employee: - Supervisor', 'Is this an Accident, Incident, Near Miss?',
      'Date & Time of Accident/Incident:', 'Place of Accident/Incident:', 'Description of Event:',
      'Any Injuries Involved?', 'Please Select One:', 'Choose type of event'
    ];

    // Check if sample row has required columns
    const sampleRow = data[0] as any;
    const missingColumns = requiredColumns.filter(col => !(col in sampleRow));
    
    if (missingColumns.length > 0) {
      return NextResponse.json(
        { error: `CSV file is missing required columns: ${missingColumns.join(', ')}. Please ensure your CSV file matches the KPA export format.` },
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
        const rawData = row as any;
        
        // Map KPA CSV columns to our database schema
        const eventData: any = {
          reportNumber: String(rawData['Report #'] || ''),
          link: String(rawData['Link'] || ''),
          observer: rawData['Observer'] || 'Unknown',
          employeeId: rawData['Employee:'] || 'Unknown', // Using employee name as ID for now
          employeeName: rawData['Employee:'] || 'Unknown',
          division: rawData['Division:'] || 'Unknown',
          homePlant: rawData['Home Plant:'] || 'Unknown',
          hireDuration: rawData['Employee: - Hire Duration'] || 'Unknown',
          supervisor: rawData['Employee: - Supervisor'] || 'Unknown',
          eventType: rawData['Is this an Accident, Incident, Near Miss?'] || 'Unknown',
          unitNumber: String(rawData['Unit #:'] || ''),
          equipmentType: rawData['Holliday Equipment Type:'] || 'Unknown',
          jobNumber: String(rawData['Job#'] || ''),
          location: rawData['Place of Accident/Incident:'] || 'Unknown',
          plant: rawData['Plant:'] || rawData['Home Plant:'] || 'Unknown', // Use Home Plant as fallback
          videoLink: rawData['Attach Video'] || '',
          description: rawData['Description of Event:'] || 'No description provided',
          injuries: rawData['Any Injuries Involved?'] === 'Yes',
          preventability: rawData['Please Select One:'] || 'Unknown',
          eventCategory: rawData['Choose type of event'] || 'Unknown',
          severityRating: 1, // Default severity rating, can be updated later
        };
        
        // Format date fields - Excel serial date conversion
        if (rawData['Employee: - Hire Date']) {
          if (typeof rawData['Employee: - Hire Date'] === 'string') {
            eventData.hireDate = new Date(rawData['Employee: - Hire Date']);
          } else if (typeof rawData['Employee: - Hire Date'] === 'number') {
            // Excel stores dates as serial numbers starting from 1900-01-01
            // Excel serial date 1 = 1900-01-01, but JavaScript Date starts from 1970-01-01
            // Excel has a bug where it treats 1900 as a leap year, so we need to subtract 1
            const excelEpoch = new Date(1900, 0, 1);
            const days = rawData['Employee: - Hire Date'] - 1; // Subtract 1 for Excel's leap year bug
            eventData.hireDate = new Date(excelEpoch.getTime() + days * 24 * 60 * 60 * 1000);
          }
        } else {
          // Default hire date if not provided
          eventData.hireDate = new Date('2020-01-01');
        }
        
        if (rawData['Date & Time of Accident/Incident:']) {
          if (typeof rawData['Date & Time of Accident/Incident:'] === 'string') {
            eventData.dateTime = new Date(rawData['Date & Time of Accident/Incident:']);
          } else if (typeof rawData['Date & Time of Accident/Incident:'] === 'number') {
            // Excel stores dates as serial numbers starting from 1900-01-01
            const excelEpoch = new Date(1900, 0, 1);
            const days = rawData['Date & Time of Accident/Incident:'] - 1; // Subtract 1 for Excel's leap year bug
            eventData.dateTime = new Date(excelEpoch.getTime() + days * 24 * 60 * 60 * 1000);
          }
        }
        
        // Validate required fields
        if (!eventData.reportNumber || !eventData.employeeName || !eventData.dateTime) {
          throw new Error('Missing required fields: Report #, Employee, or Date & Time');
        }
        
        // Check for existing event with same report number
        const existingEvent = await KpaEventModel.findOne({ 
          reportNumber: eventData.reportNumber 
        });
        
        if (existingEvent) {
          // Update existing event
          await KpaEventModel.findByIdAndUpdate(existingEvent._id, eventData);
          result.updated++;
        } else {
          // Create new event
          await KpaEventModel.create(eventData);
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
    console.error('Error importing KPA events:', error);
    return NextResponse.json(
      { error: `Failed to import KPA events: ${error.message}` },
      { status: 500 }
    );
  }
}
