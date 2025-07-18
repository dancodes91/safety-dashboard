import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import SamsaraDriverRecordModel from '@/models/SamsaraDriverRecord';

export async function GET(
  request: NextRequest,
  { params }: { params: { chartType: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { chartType } = params;

    switch (chartType) {
      case 'safety-trend':
        return await getSafetyTrendData();
      case 'driving-events':
        return await getDrivingEventsData();
      default:
        return NextResponse.json(
          { error: `Unknown chart type: ${chartType}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error fetching driver chart data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch driver chart data' },
      { status: 500 }
    );
  }
}

async function getSafetyTrendData() {
  // Get driver records from last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const records = await SamsaraDriverRecordModel.find({
    weekStartDate: { $gte: sixMonthsAgo }
  }).sort({ weekStartDate: 1 });

  // Group by month and calculate average safety scores
  const monthlyData = new Map();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Initialize last 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = months[date.getMonth()];
    monthlyData.set(monthKey, { scores: [], count: 0 });
  }

  // Group records by month
  records.forEach(record => {
    const month = months[record.weekStartDate.getMonth()];
    if (monthlyData.has(month)) {
      const data = monthlyData.get(month);
      data.scores.push(record.safetyScore);
      data.count++;
    }
  });

  // Calculate averages
  const labels = Array.from(monthlyData.keys());
  const avgScores = Array.from(monthlyData.values()).map(data => {
    if (data.scores.length === 0) return 0;
    return Math.round(data.scores.reduce((sum: number, score: number) => sum + score, 0) / data.scores.length);
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Average Safety Score',
        data: avgScores,
        backgroundColor: 'rgba(52, 211, 153, 0.2)',
        borderColor: 'rgb(52, 211, 153)',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Target',
        data: new Array(labels.length).fill(95),
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderColor: 'rgba(0, 0, 0, 0.2)',
        borderWidth: 2,
        borderDash: [5, 5],
      },
    ],
  };

  return NextResponse.json(chartData);
}

async function getDrivingEventsData() {
  // Get driver records from last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const records = await SamsaraDriverRecordModel.find({
    weekStartDate: { $gte: sixMonthsAgo }
  }).sort({ weekStartDate: 1 });

  // Group by month and sum events
  const monthlyData = new Map();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Initialize last 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = months[date.getMonth()];
    monthlyData.set(monthKey, {
      speeding: 0,
      harshAccel: 0,
      harshBrake: 0,
      harshTurn: 0,
      distracted: 0
    });
  }

  // Sum events by month
  records.forEach(record => {
    const month = months[record.weekStartDate.getMonth()];
    if (monthlyData.has(month)) {
      const data = monthlyData.get(month);
      data.speeding += (record.speedingData?.lightCount || 0) + 
                      (record.speedingData?.moderateCount || 0) + 
                      (record.speedingData?.heavyCount || 0) + 
                      (record.speedingData?.severeCount || 0);
      data.harshAccel += record.events?.harshAccel || 0;
      data.harshBrake += record.events?.harshBrake || 0;
      data.harshTurn += record.events?.harshTurn || 0;
      data.distracted += (record.events?.mobileUsage || 0) + 
                        (record.events?.inattentiveDriving || 0);
    }
  });

  const labels = Array.from(monthlyData.keys());
  const speedingData = Array.from(monthlyData.values()).map(d => d.speeding);
  const harshAccelData = Array.from(monthlyData.values()).map(d => d.harshAccel);
  const harshBrakeData = Array.from(monthlyData.values()).map(d => d.harshBrake);
  const harshTurnData = Array.from(monthlyData.values()).map(d => d.harshTurn);
  const distractedData = Array.from(monthlyData.values()).map(d => d.distracted);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Speeding Events',
        data: speedingData,
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgb(239, 68, 68)',
      },
      {
        label: 'Harsh Acceleration',
        data: harshAccelData,
        backgroundColor: 'rgba(249, 115, 22, 0.7)',
        borderColor: 'rgb(249, 115, 22)',
      },
      {
        label: 'Harsh Braking',
        data: harshBrakeData,
        backgroundColor: 'rgba(234, 179, 8, 0.7)',
        borderColor: 'rgb(234, 179, 8)',
      },
      {
        label: 'Harsh Turning',
        data: harshTurnData,
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgb(16, 185, 129)',
      },
      {
        label: 'Distracted Driving',
        data: distractedData,
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderColor: 'rgb(99, 102, 241)',
      },
    ],
  };

  return NextResponse.json(chartData);
}
