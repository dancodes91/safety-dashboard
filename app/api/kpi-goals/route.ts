import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import KpiGoalModel from '@/models/KpiGoal';

// GET handler to fetch all KPI goals with filtering options
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
    const category = searchParams.get('category');
    const metricName = searchParams.get('metricName');
    const priorityLevel = searchParams.get('priorityLevel');
    const sortBy = searchParams.get('sortBy') || 'priority';
    const sortDir = searchParams.get('sortDir') || 'asc';
    
    // Build query
    const query: any = {};
    if (category) query.category = category;
    if (metricName) query.metricName = { $regex: metricName, $options: 'i' };
    if (priorityLevel) query.priority = parseInt(priorityLevel);
    
    // Build sort options
    const sortOptions: any = {};
    sortOptions[sortBy] = sortDir === 'asc' ? 1 : -1;
    
    // Execute query
    const kpiGoals = await KpiGoalModel.find(query).sort(sortOptions);
    
    return NextResponse.json({ kpiGoals });
  } catch (error) {
    console.error('Error fetching KPI goals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch KPI goals' },
      { status: 500 }
    );
  }
}

// POST handler to create a new KPI goal
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
      'metricName', 'description', 'thresholdRed', 'thresholdYellow',
      'thresholdGreen', 'targetValue', 'unit', 'category', 'dataSource'
    ];
    
    for (const field of requiredFields) {
      if (!data[field] && data[field] !== 0) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Check for duplicate metric name
    const existingGoal = await KpiGoalModel.findOne({ metricName: data.metricName });
    if (existingGoal) {
      return NextResponse.json(
        { error: 'A KPI goal with this metric name already exists' },
        { status: 409 }
      );
    }
    
    // Create new KPI goal
    const newGoal = await KpiGoalModel.create(data);
    
    return NextResponse.json(newGoal, { status: 201 });
  } catch (error) {
    console.error('Error creating KPI goal:', error);
    return NextResponse.json(
      { error: 'Failed to create KPI goal' },
      { status: 500 }
    );
  }
}

// PUT handler to update an existing KPI goal
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
        { error: 'Missing KPI goal ID' },
        { status: 400 }
      );
    }
    
    // Find and update the KPI goal
    const updatedGoal = await KpiGoalModel.findByIdAndUpdate(
      data._id,
      data,
      { new: true, runValidators: true }
    );
    
    if (!updatedGoal) {
      return NextResponse.json(
        { error: 'KPI goal not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedGoal);
  } catch (error) {
    console.error('Error updating KPI goal:', error);
    return NextResponse.json(
      { error: 'Failed to update KPI goal' },
      { status: 500 }
    );
  }
}

// DELETE handler to remove a KPI goal
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing KPI goal ID' },
        { status: 400 }
      );
    }
    
    // Find and delete the KPI goal
    const deletedGoal = await KpiGoalModel.findByIdAndDelete(id);
    
    if (!deletedGoal) {
      return NextResponse.json(
        { error: 'KPI goal not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting KPI goal:', error);
    return NextResponse.json(
      { error: 'Failed to delete KPI goal' },
      { status: 500 }
    );
  }
}