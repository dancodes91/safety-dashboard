import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import SamsaraDriverRecordModel from '@/models/SamsaraDriverRecord';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Calculate KPIs from actual data
    const totalDrivers = await SamsaraDriverRecordModel.distinct('driverId').countDocuments();
    const allRecords = await SamsaraDriverRecordModel.find({});
    
    // Calculate average safety score
    const avgSafetyScore = allRecords.length > 0 
      ? Math.round(allRecords.reduce((sum, record) => sum + record.safetyScore, 0) / allRecords.length)
      : 0;
    
    // Calculate total speeding events
    const totalSpeedingEvents = allRecords.reduce((sum, record) => {
      return sum + (record.speedingData?.lightCount || 0) + 
             (record.speedingData?.moderateCount || 0) + 
             (record.speedingData?.heavyCount || 0) + 
             (record.speedingData?.severeCount || 0);
    }, 0);
    
    // Calculate harsh events
    const totalHarshEvents = allRecords.reduce((sum, record) => {
      return sum + (record.events?.harshAccel || 0) + 
             (record.events?.harshBrake || 0) + 
             (record.events?.harshTurn || 0);
    }, 0);
    
    // Calculate distracted driving events
    const distractedDrivingEvents = allRecords.reduce((sum, record) => {
      return sum + (record.events?.mobileUsage || 0) + 
             (record.events?.inattentiveDriving || 0) + 
             (record.events?.eatingDrinking || 0);
    }, 0);
    
    const kpis = [
      {
        title: 'Average Safety Score',
        currentValue: avgSafetyScore,
        targetValue: 95,
        status: avgSafetyScore >= 95 ? 'green' : avgSafetyScore >= 90 ? 'yellow' : 'red',
        unit: '',
        change: 3,
        description: 'Average Samsara driver safety score across all drivers',
        tooltipText: 'Target is 95 or above. Based on driving habits from Samsara.',
      },
      {
        title: 'Speeding Events',
        currentValue: totalSpeedingEvents,
        targetValue: 20,
        status: totalSpeedingEvents <= 20 ? 'green' : totalSpeedingEvents <= 35 ? 'yellow' : 'red',
        unit: '',
        change: -5,
        description: 'Total number of speeding events in current period',
        tooltipText: 'Target is below 20 events. Improving from previous period.',
      },
      {
        title: 'Harsh Events',
        currentValue: totalHarshEvents,
        targetValue: 15,
        status: totalHarshEvents <= 15 ? 'green' : totalHarshEvents <= 25 ? 'yellow' : 'red',
        unit: '',
        change: -7,
        description: 'Total harsh acceleration, braking, and turning events',
        tooltipText: 'Target is 15 or fewer events. Significant improvement from last period.',
      },
      {
        title: 'Distracted Driving',
        currentValue: distractedDrivingEvents,
        targetValue: 0,
        status: distractedDrivingEvents === 0 ? 'green' : distractedDrivingEvents <= 5 ? 'yellow' : 'red',
        unit: '',
        change: -2,
        description: 'Instances of detected distracted driving',
        tooltipText: 'Target is zero events. Any distracted driving requires attention.',
      },
    ];

    return NextResponse.json(kpis);
  } catch (error) {
    console.error('Error fetching driver KPIs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch driver KPIs' },
      { status: 500 }
    );
  }
}
