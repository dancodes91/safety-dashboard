import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import KpaEventModel from '@/models/KpaEvent';

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
      case 'trend':
        return await getIncidentTrendData();
      case 'types':
        return await getIncidentTypeData();
      default:
        return NextResponse.json(
          { error: `Unknown chart type: ${chartType}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error fetching incident chart data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch incident chart data' },
      { status: 500 }
    );
  }
}

async function getIncidentTrendData() {
  // Get incidents from last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const incidents = await KpaEventModel.find({
    dateTime: { $gte: sixMonthsAgo }
  });

  // Group by month
  const monthlyData = new Map();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Initialize last 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = months[date.getMonth()];
    monthlyData.set(monthKey, { recordable: 0, nearMiss: 0 });
  }

  // Count incidents by month
  incidents.forEach(incident => {
    const month = months[incident.dateTime.getMonth()];
    if (monthlyData.has(month)) {
      const data = monthlyData.get(month);
      if (incident.eventCategory === 'Near Miss') {
        data.nearMiss++;
      } else {
        data.recordable++;
      }
    }
  });

  const labels = Array.from(monthlyData.keys());
  const recordableData = Array.from(monthlyData.values()).map(d => d.recordable);
  const nearMissData = Array.from(monthlyData.values()).map(d => d.nearMiss);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Recordable Incidents',
        data: recordableData,
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
      {
        label: 'Near Misses',
        data: nearMissData,
        backgroundColor: 'rgba(249, 115, 22, 0.5)',
        borderColor: 'rgb(249, 115, 22)',
        borderWidth: 1,
      },
    ],
  };

  return NextResponse.json(chartData);
}

async function getIncidentTypeData() {
  // Get all incidents and group by event category
  const incidents = await KpaEventModel.find({});
  
  const typeCount = new Map();
  incidents.forEach(incident => {
    const category = incident.eventCategory || 'Other';
    typeCount.set(category, (typeCount.get(category) || 0) + 1);
  });

  // Convert to arrays for chart
  const labels = Array.from(typeCount.keys());
  const data = Array.from(typeCount.values());
  
  const colors = [
    'rgba(239, 68, 68, 0.7)',
    'rgba(249, 115, 22, 0.7)',
    'rgba(234, 179, 8, 0.7)',
    'rgba(16, 185, 129, 0.7)',
    'rgba(99, 102, 241, 0.7)',
    'rgba(168, 85, 247, 0.7)',
  ];

  const borderColors = [
    'rgb(239, 68, 68)',
    'rgb(249, 115, 22)',
    'rgb(234, 179, 8)',
    'rgb(16, 185, 129)',
    'rgb(99, 102, 241)',
    'rgb(168, 85, 247)',
  ];

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Incident Types',
        data,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: borderColors.slice(0, labels.length),
        borderWidth: 1,
      },
    ],
  };

  return NextResponse.json(chartData);
}
