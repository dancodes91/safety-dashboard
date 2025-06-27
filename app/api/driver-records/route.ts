import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import SamsaraDriverRecordModel from '@/models/SamsaraDriverRecord';

// GET handler to fetch driver records with filtering options
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
    const driverId = searchParams.get('driverId');
    const driverName = searchParams.get('driverName');
    const division = searchParams.get('division');
    const homePlant = searchParams.get('homePlant');
    const minSafetyScore = searchParams.get('minSafetyScore');
    const maxSafetyScore = searchParams.get('maxSafetyScore');
    const sortBy = searchParams.get('sortBy') || 'safetyScore';
    const sortDir = searchParams.get('sortDir') || 'desc';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 100;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
    
    // Build query
    const query: any = {};
    if (driverId) query.driverId = driverId;
    if (driverName) query.driverName = { $regex: driverName, $options: 'i' };
    if (division) query.division = division;
    if (homePlant) query.homePlant = homePlant;
    
    // Safety score range filtering
    if (minSafetyScore || maxSafetyScore) {
      query.safetyScore = {};
      if (minSafetyScore) query.safetyScore.$gte = parseInt(minSafetyScore);
      if (maxSafetyScore) query.safetyScore.$lte = parseInt(maxSafetyScore);
    }
    
    // Build sort options
    const sortOptions: any = {};
    sortOptions[sortBy] = sortDir === 'asc' ? 1 : -1;
    
    // Execute query with pagination
    const skip = (page - 1) * limit;
    const drivers = await SamsaraDriverRecordModel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);
    
    const total = await SamsaraDriverRecordModel.countDocuments(query);
    
    return NextResponse.json({
      drivers,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching driver records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch driver records' },
      { status: 500 }
    );
  }
}

// POST handler to create or update a driver record
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
      'driverId', 'driverName', 'division', 'homePlant', 
      'hireDate', 'supervisor', 'safetyScore', 'previousSafetyScore',
      'safetyScoreDelta', 'driveTime', 'totalMiles', 'speedingData',
      'alertCount', 'warningCount', 'criticalCount', 
      'vehicleInspectionCount', 'coachingSessionsCompleted',
      'coachingSessionsRequired', 'lastRecordedDate'
    ];
    
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Validate speedingData required fields
    const speedingDataFields = [
      'lightTime', 'moderateTime', 'heavyTime', 'totalTime',
      'averageSpeed', 'maxSpeed', 'speedLimit', 'countOverSpeed',
      'percentageOverSpeed'
    ];
    
    for (const field of speedingDataFields) {
      if (!data.speedingData[field]) {
        return NextResponse.json(
          { error: `Missing required speedingData field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Check if this is an update or a new record
    const existingRecord = await SamsaraDriverRecordModel.findOne({ driverId: data.driverId });
    let driverRecord;
    
    if (existingRecord) {
      // Update existing record
      driverRecord = await SamsaraDriverRecordModel.findOneAndUpdate(
        { driverId: data.driverId },
        data,
        { new: true, runValidators: true }
      );
      
      return NextResponse.json(driverRecord);
    } else {
      // Create new record
      driverRecord = await SamsaraDriverRecordModel.create(data);
      
      return NextResponse.json(driverRecord, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating/updating driver record:', error);
    return NextResponse.json(
      { error: 'Failed to create/update driver record' },
      { status: 500 }
    );
  }
}