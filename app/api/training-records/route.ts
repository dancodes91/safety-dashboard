import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import TrainingRecordModel from '@/models/TrainingRecord';

// GET handler to fetch training records with filtering options
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    // Get URL params for filtering
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const employeeName = searchParams.get('employeeName');
    const division = searchParams.get('division');
    const trainingType = searchParams.get('trainingType');
    const status = searchParams.get('status');
    const expiringBefore = searchParams.get('expiringBefore');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 100;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
    
    // Build query
    const query: any = {};
    if (employeeId) query.employeeId = employeeId;
    if (employeeName) query.employeeName = { $regex: employeeName, $options: 'i' };
    if (division) query.division = division;
    if (trainingType) query.trainingType = trainingType;
    if (status) query.status = status;
    
    // Add expiration date filter if provided
    if (expiringBefore) {
      query.expirationDate = { $lte: new Date(expiringBefore) };
    }
    
    // Execute query with pagination
    const skip = (page - 1) * limit;
    const records = await TrainingRecordModel.find(query)
      .sort({ requiredByDate: 1 })
      .skip(skip)
      .limit(limit);
    
    const total = await TrainingRecordModel.countDocuments(query);
    
    // Get training compliance stats
    const totalTrainings = await TrainingRecordModel.countDocuments();
    const completedTrainings = await TrainingRecordModel.countDocuments({ status: 'completed' });
    const pendingTrainings = await TrainingRecordModel.countDocuments({ status: 'pending' });
    const overdueTrainings = await TrainingRecordModel.countDocuments({ status: 'overdue' });
    const expiredTrainings = await TrainingRecordModel.countDocuments({ status: 'expired' });
    
    // Calculate compliance percentage
    const compliancePercentage = totalTrainings > 0 
      ? Math.round((completedTrainings / totalTrainings) * 100) 
      : 0;
    
    return NextResponse.json({
      records,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      },
      stats: {
        total: totalTrainings,
        completed: completedTrainings,
        pending: pendingTrainings,
        overdue: overdueTrainings,
        expired: expiredTrainings,
        compliancePercentage
      }
    });
  } catch (error) {
    console.error('Error fetching training records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch training records' },
      { status: 500 }
    );
  }
}

// POST handler to create a new training record
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
    
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'employeeId', 'employeeName', 'division', 
      'trainingType', 'trainingName', 'requiredByDate'
    ];
    
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Create new training record
    const newRecord = await TrainingRecordModel.create(data);
    
    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    console.error('Error creating training record:', error);
    return NextResponse.json(
      { error: 'Failed to create training record' },
      { status: 500 }
    );
  }
}

// PUT handler to update training record status
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    const data = await request.json();
    
    if (!data._id) {
      return NextResponse.json(
        { error: 'Missing training record ID' },
        { status: 400 }
      );
    }
    
    // Update training record
    const updatedRecord = await TrainingRecordModel.findByIdAndUpdate(
      data._id,
      data,
      { new: true, runValidators: true }
    );
    
    if (!updatedRecord) {
      return NextResponse.json(
        { error: 'Training record not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedRecord);
  } catch (error) {
    console.error('Error updating training record:', error);
    return NextResponse.json(
      { error: 'Failed to update training record' },
      { status: 500 }
    );
  }
}

// Helper endpoint to mark training as completed
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    const data = await request.json();
    
    if (!data._id) {
      return NextResponse.json(
        { error: 'Missing training record ID' },
        { status: 400 }
      );
    }
    
    // Find the training record
    const trainingRecord = await TrainingRecordModel.findById(data._id);
    
    if (!trainingRecord) {
      return NextResponse.json(
        { error: 'Training record not found' },
        { status: 404 }
      );
    }
    
    // Update status to completed and set completion date
    trainingRecord.status = 'completed';
    trainingRecord.completionDate = new Date();
    
    // Save the updated record
    await trainingRecord.save();
    
    return NextResponse.json(trainingRecord);
  } catch (error) {
    console.error('Error marking training as completed:', error);
    return NextResponse.json(
      { error: 'Failed to mark training as completed' },
      { status: 500 }
    );
  }
}