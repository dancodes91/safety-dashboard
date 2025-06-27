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

    // Expected columns
    const requiredColumns = [
      'reportNumber', 'observer', 'employeeId', 'employeeName',
      'division', 'homePlant', 'hireDate', 'supervisor',
      'eventType', 'unitNumber', 'equipmentType', 'jobNumber',
      'dateTime', 'location', 'plant', 'description',
      'preventability', 'eventCategory', 'severityRating'
    ];

    // Check if sample row has required columns
    const sampleRow = data[0] as any;
    const missingColumns = requiredColumns.filter(col => !(col in sampleRow));
    
    if (missingColumns.length > 0) {
      return NextResponse.json(
        { error: `Excel file is missing required columns: ${missingColumns.join(', ')}` },
        { status: 400 }
      );
    }

    // Process and insert each row
    const result = {
      totalRows: data.length,
      imported: 0,
      errors: 0,
      errorDetails: [] as string[]
    };

    for (const row of data) {
      try {
        const eventData = row as any;
        
        // Format date fields
        if (eventData.hireDate) {
          if (typeof eventData.hireDate === 'string') {
            eventData.hireDate = new Date(eventData.hireDate);
          } else if (typeof eventData.hireDate === 'number') {
            // Excel stores dates as serial numbers, convert to JS date
            eventData.hireDate = XLSX.SSF.parse_date_code(eventData.hireDate);
          }
        }
        
        if (eventData.dateTime) {
          if (typeof eventData.dateTime === 'string') {
            eventData.dateTime = new Date(eventData.dateTime);
          } else if (typeof eventData.dateTime === 'number') {
            eventData.dateTime = XLSX.SSF.parse_date_code(eventData.dateTime);
          }
        }
        
        // Check for existing event with same report number
        const existingEvent = await KpaEventModel.findOne({ 
          reportNumber: eventData.reportNumber 
        });
        
        if (existingEvent) {
          // Update existing event
          await KpaEventModel.findByIdAndUpdate(existingEvent._id, eventData);
        } else {
          // Create new event
          await KpaEventModel.create(eventData);
        }
        
        result.imported++;
      } catch (error: any) {
        result.errors++;
        result.errorDetails.push(`Row ${result.imported + result.errors}: ${error.message}`);
      }
    }

    return NextResponse.json({ 
      message: `Import completed. ${result.imported} records imported, ${result.errors} errors.`,
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