import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import TrainingRecordModel from '@/models/TrainingRecord';
import * as XLSX from 'xlsx';

interface TrainingRecordData {
  employeeId: string;
  employeeName: string;
  division?: string;
  plant?: string;
  trainingType: string;
  trainingName: string;
  status?: string;
  completionDate?: Date | string;
  expirationDate?: Date | string;
  score?: number;
  instructor?: string;
  requiredByDate?: Date | string;
  [key: string]: any;
}

interface ImportResult {
  totalRows: number;
  imported: number;
  updated: number;
  errors: number;
  errorDetails: string[];
}

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

    // Expected columns
    const requiredColumns = [
      'employeeId', 'employeeName', 'division', 
      'trainingType', 'trainingName', 'requiredByDate'
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
      updated: 0,
      errors: 0,
      errorDetails: [] as string[]
    };

    for (const row of data) {
      try {
        const rawData = row as any;
        
        // Helper functions for robust data handling
        const safeString = (value: any, defaultValue: string = ''): string => {
          if (value === null || value === undefined) return defaultValue;
          return String(value).trim();
        };

        const safeNumber = (value: any, defaultValue: number = 0): number => {
          if (value === null || value === undefined || value === '') return defaultValue;
          const num = Number(value);
          return isNaN(num) ? defaultValue : num;
        };

        const safeDate = (value: any): Date | undefined => {
          if (!value) return undefined;
          try {
            if (typeof value === 'string') {
              const parsed = new Date(value);
              return isNaN(parsed.getTime()) ? undefined : parsed;
            } else if (typeof value === 'number') {
              // Excel serial date conversion
              const excelEpoch = new Date(1900, 0, 1);
              const days = value - 1; // Subtract 1 for Excel's leap year bug
              return new Date(excelEpoch.getTime() + days * 24 * 60 * 60 * 1000);
            }
            return new Date(value);
          } catch {
            return undefined;
          }
        };

        const trainingData: TrainingRecordData = {
          employeeId: safeString(rawData.employeeId || rawData['Employee ID'] || rawData['employeeId']),
          employeeName: safeString(rawData.employeeName || rawData['Employee Name'] || rawData['employeeName']),
          division: safeString(rawData.division || rawData['Division'] || rawData['division']),
          plant: safeString(rawData.plant || rawData['Plant'] || rawData['plant']),
          trainingType: safeString(rawData.trainingType || rawData['Training Type'] || rawData['trainingType']),
          trainingName: safeString(rawData.trainingName || rawData['Training Name'] || rawData['trainingName']),
          instructor: safeString(rawData.instructor || rawData['Instructor'] || rawData['instructor']),
          score: safeNumber(rawData.score || rawData['Score'] || rawData['score']),
        };

        // Handle date fields with robust parsing
        trainingData.requiredByDate = safeDate(rawData.requiredByDate || rawData['Required By Date'] || rawData['requiredByDate']);
        trainingData.completionDate = safeDate(rawData.completionDate || rawData['Completion Date'] || rawData['completionDate']);
        trainingData.expirationDate = safeDate(rawData.expirationDate || rawData['Expiration Date'] || rawData['expirationDate']);

        // Validate required fields
        if (!trainingData.employeeId) {
          throw new Error('Missing required field: Employee ID');
        }
        if (!trainingData.employeeName) {
          throw new Error('Missing required field: Employee Name');
        }
        if (!trainingData.trainingType) {
          throw new Error('Missing required field: Training Type');
        }
        if (!trainingData.trainingName) {
          throw new Error('Missing required field: Training Name');
        }
        
        // Validate status field
        if (trainingData.status) {
          const validStatuses = ['completed', 'pending', 'overdue', 'expired'];
          if (!validStatuses.includes(trainingData.status.toLowerCase())) {
            trainingData.status = 'pending'; // Default to pending if invalid
          } else {
            trainingData.status = trainingData.status.toLowerCase();
          }
        } else {
          trainingData.status = 'pending'; // Default status
        }
        
        // Set automatic status based on dates if not provided
        if (trainingData.status === 'pending') {
          const today = new Date();
          
          if (trainingData.requiredByDate && new Date(trainingData.requiredByDate) < today) {
            trainingData.status = 'overdue';
          }
          
          if (trainingData.completionDate) {
            trainingData.status = 'completed';
            
            // Check if training is expired
            if (trainingData.expirationDate && new Date(trainingData.expirationDate) < today) {
              trainingData.status = 'expired';
            }
          }
        }
        
        // Check for existing training record for this employee and training type
        const existingRecord = await TrainingRecordModel.findOne({ 
          employeeId: trainingData.employeeId,
          trainingType: trainingData.trainingType,
          trainingName: trainingData.trainingName
        });
        
        if (existingRecord) {
          // Update existing record
          await TrainingRecordModel.findByIdAndUpdate(existingRecord._id, trainingData);
          result.updated++;
        } else {
          // Create new record
          await TrainingRecordModel.create(trainingData);
          result.imported++;
        }
      } catch (error: any) {
        result.errors++;
        result.errorDetails.push(`Row ${result.imported + result.updated + result.errors}: ${error.message}`);
      }
    }

    // Calculate compliance stats after import
    const totalTrainings = await TrainingRecordModel.countDocuments();
    const completedTrainings = await TrainingRecordModel.countDocuments({ status: 'completed' });
    
    // Calculate compliance percentage
    const compliancePercentage = totalTrainings > 0 
      ? Math.round((completedTrainings / totalTrainings) * 100) 
      : 0;

    return NextResponse.json({ 
      message: `Import completed. ${result.imported} records imported, ${result.updated} records updated, ${result.errors} errors.`,
      result,
      stats: {
        totalTrainings,
        completedTrainings,
        compliancePercentage
      }
    });
  } catch (error: any) {
    console.error('Error importing training records:', error);
    return NextResponse.json(
      { error: `Failed to import training records: ${error.message}` },
      { status: 500 }
    );
  }
}
