import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import KpaEventModel from '@/models/KpaEvent';

// GET handler to fetch all KPA events with filtering options
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
    const division = searchParams.get('division');
    const eventType = searchParams.get('eventType');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const preventability = searchParams.get('preventability');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 100;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
    
    // Build query
    const query: any = {};
    if (division) query.division = division;
    if (eventType) query.eventType = eventType;
    if (preventability) query.preventability = preventability;
    
    // Date range filtering
    if (startDate || endDate) {
      query.dateTime = {};
      if (startDate) query.dateTime.$gte = new Date(startDate);
      if (endDate) query.dateTime.$lte = new Date(endDate);
    }
    
    // Execute query with pagination
    const skip = (page - 1) * limit;
    const events = await KpaEventModel.find(query)
      .sort({ dateTime: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await KpaEventModel.countDocuments(query);
    
    return NextResponse.json({
      events,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching KPA events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch KPA events' },
      { status: 500 }
    );
  }
}

// POST handler to create a new KPA event
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
      'reportNumber', 'observer', 'employeeId', 'employeeName',
      'division', 'homePlant', 'hireDate', 'supervisor',
      'eventType', 'unitNumber', 'equipmentType', 'jobNumber',
      'dateTime', 'location', 'plant', 'description',
      'preventability', 'eventCategory', 'severityRating'
    ];
    
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Check for duplicate report number
    const existingEvent = await KpaEventModel.findOne({ reportNumber: data.reportNumber });
    if (existingEvent) {
      return NextResponse.json(
        { error: 'An event with this report number already exists' },
        { status: 409 }
      );
    }
    
    // Create new event
    const newEvent = await KpaEventModel.create(data);
    
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error('Error creating KPA event:', error);
    return NextResponse.json(
      { error: 'Failed to create KPA event' },
      { status: 500 }
    );
  }
}